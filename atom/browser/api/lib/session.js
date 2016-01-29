const EventEmitter = require('events').EventEmitter;
const bindings = process.atomBinding('session');
const PERSIST_PERFIX = 'persist:';

// Returns the Session from |partition| string.
exports.fromPartition = function(partition) {
  if (partition == null) {
    partition = '';
  }
  if (partition === '') {
    return exports.defaultSession;
  }
  if (partition.startsWith(PERSIST_PERFIX)) {
    return bindings.fromPartition(partition.substr(PERSIST_PERFIX.length), false);
  } else {
    return bindings.fromPartition(partition, true);
  }
};

// Returns the default session.
Object.defineProperty(exports, 'defaultSession', {
  enumerable: true,
  get: function() {
    return bindings.fromPartition('', false);
  }
});

var wrapSession = function(session) {
  // session is an EventEmitter.
  return session.__proto__ = EventEmitter.prototype;
};

bindings._setWrapSession(wrapSession);
