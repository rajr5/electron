const app = require('electron').app;
const BrowserWindow = require('electron').BrowserWindow;
const binding = process.atomBinding('dialog');
const v8Util = process.atomBinding('v8_util');

var slice = [].slice;
var includes = [].includes;

var fileDialogProperties = {
  openFile: 1 << 0,
  openDirectory: 1 << 1,
  multiSelections: 1 << 2,
  createDirectory: 1 << 3
};

var messageBoxTypes = ['none', 'info', 'warning', 'error', 'question'];

var messageBoxOptions = {
  noLink: 1 << 0
};

var parseArgs = function(window, options, callback) {
  if (!(window === null || (window != null ? window.constructor : void 0) === BrowserWindow)) {
    // Shift.
    callback = options;
    options = window;
    window = null;
  }
  if ((callback == null) && typeof options === 'function') {
    // Shift.
    callback = options;
    options = null;
  }
  return [window, options, callback];
};

var checkAppInitialized = function() {
  if (!app.isReady()) {
    throw new Error('dialog module can only be used after app is ready');
  }
};

module.exports = {
  showOpenDialog: function() {
    var args, callback, options, prop, properties, ref1, value, window, wrappedCallback;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    checkAppInitialized();
    ref1 = parseArgs.apply(null, args), window = ref1[0], options = ref1[1], callback = ref1[2];
    if (options == null) {
      options = {
        title: 'Open',
        properties: ['openFile']
      };
    }
    if (options.properties == null) {
      options.properties = ['openFile'];
    }
    if (!Array.isArray(options.properties)) {
      throw new TypeError('Properties need to be array');
    }
    properties = 0;
    for (prop in fileDialogProperties) {
      value = fileDialogProperties[prop];
      if (includes.call(options.properties, prop)) {
        properties |= value;
      }
    }
    if (options.title == null) {
      options.title = '';
    }
    if (options.defaultPath == null) {
      options.defaultPath = '';
    }
    if (options.filters == null) {
      options.filters = [];
    }
    wrappedCallback = typeof callback === 'function' ? function(success, result) {
      return callback(success ? result : void 0);
    } : null;
    return binding.showOpenDialog(String(options.title), String(options.defaultPath), options.filters, properties, window, wrappedCallback);
  },
  showSaveDialog: function() {
    var args, callback, options, ref1, window, wrappedCallback;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    checkAppInitialized();
    ref1 = parseArgs.apply(null, args), window = ref1[0], options = ref1[1], callback = ref1[2];
    if (options == null) {
      options = {
        title: 'Save'
      };
    }
    if (options.title == null) {
      options.title = '';
    }
    if (options.defaultPath == null) {
      options.defaultPath = '';
    }
    if (options.filters == null) {
      options.filters = [];
    }
    wrappedCallback = typeof callback === 'function' ? function(success, result) {
      return callback(success ? result : void 0);
    } : null;
    return binding.showSaveDialog(String(options.title), String(options.defaultPath), options.filters, window, wrappedCallback);
  },
  showMessageBox: function() {
    var args, callback, flags, i, j, len, messageBoxType, options, ref1, ref2, ref3, text, window;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    checkAppInitialized();
    ref1 = parseArgs.apply(null, args), window = ref1[0], options = ref1[1], callback = ref1[2];
    if (options == null) {
      options = {
        type: 'none'
      };
    }
    if (options.type == null) {
      options.type = 'none';
    }
    messageBoxType = messageBoxTypes.indexOf(options.type);
    if (!(messageBoxType > -1)) {
      throw new TypeError('Invalid message box type');
    }
    if (!Array.isArray(options.buttons)) {
      throw new TypeError('Buttons need to be array');
    }
    if (options.title == null) {
      options.title = '';
    }
    if (options.message == null) {
      options.message = '';
    }
    if (options.detail == null) {
      options.detail = '';
    }
    if (options.icon == null) {
      options.icon = null;
    }
    if (options.defaultId == null) {
      options.defaultId = -1;
    }

    // Choose a default button to get selected when dialog is cancelled.
    if (options.cancelId == null) {
      options.cancelId = 0;
      ref2 = options.buttons;
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        text = ref2[i];
        if ((ref3 = text.toLowerCase()) === 'cancel' || ref3 === 'no') {
          options.cancelId = i;
          break;
        }
      }
    }
    flags = options.noLink ? messageBoxOptions.noLink : 0;
    return binding.showMessageBox(messageBoxType, options.buttons, options.defaultId, options.cancelId, flags, options.title, options.message, options.detail, options.icon, window, callback);
  },
  showErrorBox: function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return binding.showErrorBox.apply(binding, args);
  }
};

// Mark standard asynchronous functions.
var ref1 = ['showMessageBox', 'showOpenDialog', 'showSaveDialog'];
var j, len, api;
for (j = 0, len = ref1.length; j < len; j++) {
  api = ref1[j];
  v8Util.setHiddenValue(module.exports[api], 'asynchronous', true);
}
