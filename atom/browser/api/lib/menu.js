const BrowserWindow = require('electron').BrowserWindow;
const MenuItem = require('electron').MenuItem;
const EventEmitter = require('events').EventEmitter;
const v8Util = process.atomBinding('v8_util');
const bindings = process.atomBinding('menu');

// Automatically generated radio menu item's group id.
var nextGroupId = 0;

// Search between seperators to find a radio menu item and return its group id,
// otherwise generate a group id.
var generateGroupId = function(items, pos) {
  var i, item, j, k, ref1, ref2, ref3;
  if (pos > 0) {
    for (i = j = ref1 = pos - 1; ref1 <= 0 ? j <= 0 : j >= 0; i = ref1 <= 0 ? ++j : --j) {
      item = items[i];
      if (item.type === 'radio') {
        return item.groupId;
      }
      if (item.type === 'separator') {
        break;
      }
    }
  } else if (pos < items.length) {
    for (i = k = ref2 = pos, ref3 = items.length - 1; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
      item = items[i];
      if (item.type === 'radio') {
        return item.groupId;
      }
      if (item.type === 'separator') {
        break;
      }
    }
  }
  return ++nextGroupId;
};

// Returns the index of item according to |id|.
var indexOfItemById = function(items, id) {
  var i, item, j, len;
  for (i = j = 0, len = items.length; j < len; i = ++j) {
    item = items[i];
    if (item.id === id) {
      return i;
    }
  }
  return -1;
};

// Returns the index of where to insert the item according to |position|.
var indexToInsertByPosition = function(items, position) {
  var id, insertIndex, query, ref1;
  if (!position) {
    return items.length;
  }
  ref1 = position.split('='), query = ref1[0], id = ref1[1];
  insertIndex = indexOfItemById(items, id);
  if (insertIndex === -1 && query !== 'endof') {
    console.warn("Item with id '" + id + "' is not found");
    return items.length;
  }
  switch (query) {
    case 'after':
      insertIndex++;
      break;
    case 'endof':

      // If the |id| doesn't exist, then create a new group with the |id|.
      if (insertIndex === -1) {
        items.push({
          id: id,
          type: 'separator'
        });
        insertIndex = items.length - 1;
      }

      // Find the end of the group.
      insertIndex++;
      while (insertIndex < items.length && items[insertIndex].type !== 'separator') {
        insertIndex++;
      }
  }
  return insertIndex;
};

const Menu = bindings.Menu;

Menu.prototype.__proto__ = EventEmitter.prototype;

Menu.prototype._init = function() {
  this.commandsMap = {};
  this.groupsMap = {};
  this.items = [];
  return this.delegate = {
    isCommandIdChecked: (function(_this) {
      return function(commandId) {
        var ref1;
        return (ref1 = _this.commandsMap[commandId]) != null ? ref1.checked : void 0;
      };
    })(this),
    isCommandIdEnabled: (function(_this) {
      return function(commandId) {
        var ref1;
        return (ref1 = _this.commandsMap[commandId]) != null ? ref1.enabled : void 0;
      };
    })(this),
    isCommandIdVisible: (function(_this) {
      return function(commandId) {
        var ref1;
        return (ref1 = _this.commandsMap[commandId]) != null ? ref1.visible : void 0;
      };
    })(this),
    getAcceleratorForCommandId: (function(_this) {
      return function(commandId) {
        var ref1;
        return (ref1 = _this.commandsMap[commandId]) != null ? ref1.accelerator : void 0;
      };
    })(this),
    getIconForCommandId: (function(_this) {
      return function(commandId) {
        var ref1;
        return (ref1 = _this.commandsMap[commandId]) != null ? ref1.icon : void 0;
      };
    })(this),
    executeCommand: (function(_this) {
      return function(commandId) {
        var ref1;
        return (ref1 = _this.commandsMap[commandId]) != null ? ref1.click(BrowserWindow.getFocusedWindow()) : void 0;
      };
    })(this),
    menuWillShow: (function(_this) {
      return function() {

        // Make sure radio groups have at least one menu item seleted.
        var checked, group, id, j, len, radioItem, ref1, results;
        ref1 = _this.groupsMap;
        results = [];
        for (id in ref1) {
          group = ref1[id];
          checked = false;
          for (j = 0, len = group.length; j < len; j++) {
            radioItem = group[j];
            if (!radioItem.checked) {
              continue;
            }
            checked = true;
            break;
          }
          if (!checked) {
            results.push(v8Util.setHiddenValue(group[0], 'checked', true));
          } else {
            results.push(void 0);
          }
        }
        return results;
      };
    })(this)
  };
};

Menu.prototype.popup = function(window, x, y, positioningItem) {
  if (typeof window != 'object' || window.constructor !== BrowserWindow) {
    // Shift.
    positioningItem = y;
    y = x;
    x = window;
    window = BrowserWindow.getFocusedWindow();
  }

  // Default parameters.
  if (typeof x !== 'number') x = -1;
  if (typeof y !== 'number') y = -1;
  if (typeof positioningItem !== 'number') positioningItem = 0;

  this.popupAt(window, x, y, positioningItem);
};

Menu.prototype.append = function(item) {
  return this.insert(this.getItemCount(), item);
};

Menu.prototype.insert = function(pos, item) {
  var base, name;
  if ((item != null ? item.constructor : void 0) !== MenuItem) {
    throw new TypeError('Invalid item');
  }
  switch (item.type) {
    case 'normal':
      this.insertItem(pos, item.commandId, item.label);
      break;
    case 'checkbox':
      this.insertCheckItem(pos, item.commandId, item.label);
      break;
    case 'separator':
      this.insertSeparator(pos);
      break;
    case 'submenu':
      this.insertSubMenu(pos, item.commandId, item.label, item.submenu);
      break;
    case 'radio':
      // Grouping radio menu items.
      item.overrideReadOnlyProperty('groupId', generateGroupId(this.items, pos));
      if ((base = this.groupsMap)[name = item.groupId] == null) {
        base[name] = [];
      }
      this.groupsMap[item.groupId].push(item);

      // Setting a radio menu item should flip other items in the group.
      v8Util.setHiddenValue(item, 'checked', item.checked);
      Object.defineProperty(item, 'checked', {
        enumerable: true,
        get: function() {
          return v8Util.getHiddenValue(item, 'checked');
        },
        set: (function(_this) {
          return function() {
            var j, len, otherItem, ref1;
            ref1 = _this.groupsMap[item.groupId];
            for (j = 0, len = ref1.length; j < len; j++) {
              otherItem = ref1[j];
              if (otherItem !== item) {
                v8Util.setHiddenValue(otherItem, 'checked', false);
              }
            }
            return v8Util.setHiddenValue(item, 'checked', true);
          };
        })(this)
      });
      this.insertRadioItem(pos, item.commandId, item.label, item.groupId);
  }
  if (item.sublabel != null) {
    this.setSublabel(pos, item.sublabel);
  }
  if (item.icon != null) {
    this.setIcon(pos, item.icon);
  }
  if (item.role != null) {
    this.setRole(pos, item.role);
  }

  // Make menu accessable to items.
  item.overrideReadOnlyProperty('menu', this);

  // Remember the items.
  this.items.splice(pos, 0, item);
  return this.commandsMap[item.commandId] = item;
};


// Force menuWillShow to be called
Menu.prototype._callMenuWillShow = function() {
  var item, j, len, ref1, ref2, results;
  if ((ref1 = this.delegate) != null) {
    ref1.menuWillShow();
  }
  ref2 = this.items;
  results = [];
  for (j = 0, len = ref2.length; j < len; j++) {
    item = ref2[j];
    if (item.submenu != null) {
      results.push(item.submenu._callMenuWillShow());
    }
  }
  return results;
};

var applicationMenu = null;

Menu.setApplicationMenu = function(menu) {
  var j, len, results, w, windows;
  if (!(menu === null || menu.constructor === Menu)) {
    throw new TypeError('Invalid menu');
  }

  // Keep a reference.
  applicationMenu = menu;
  if (process.platform === 'darwin') {
    if (menu === null) {
      return;
    }
    menu._callMenuWillShow();
    return bindings.setApplicationMenu(menu);
  } else {
    windows = BrowserWindow.getAllWindows();
    results = [];
    for (j = 0, len = windows.length; j < len; j++) {
      w = windows[j];
      results.push(w.setMenu(menu));
    }
    return results;
  }
};

Menu.getApplicationMenu = function() {
  return applicationMenu;
};

Menu.sendActionToFirstResponder = bindings.sendActionToFirstResponder;

Menu.buildFromTemplate = function(template) {
  var insertIndex, item, j, k, key, len, len1, menu, menuItem, positionedTemplate, value;
  if (!Array.isArray(template)) {
    throw new TypeError('Invalid template for Menu');
  }
  positionedTemplate = [];
  insertIndex = 0;
  for (j = 0, len = template.length; j < len; j++) {
    item = template[j];
    if (item.position) {
      insertIndex = indexToInsertByPosition(positionedTemplate, item.position);
    } else {
      // If no |position| is specified, insert after last item.
      insertIndex++;
    }
    positionedTemplate.splice(insertIndex, 0, item);
  }
  menu = new Menu;
  for (k = 0, len1 = positionedTemplate.length; k < len1; k++) {
    item = positionedTemplate[k];
    if (typeof item !== 'object') {
      throw new TypeError('Invalid template for MenuItem');
    }
    menuItem = new MenuItem(item);
    for (key in item) {
      value = item[key];
      if (menuItem[key] == null) {
        menuItem[key] = value;
      }
    }
    menu.append(menuItem);
  }
  return menu;
};

module.exports = Menu;
