{ipcRenderer, deprecate} = require 'electron'
{EventEmitter} = require 'events'

# This module is deprecated, we mirror everything from ipcRenderer.
deprecate.warn 'ipc module', 'require("electron").ipcRenderer'

# Routes events of ipcRenderer.
ipc = new EventEmitter
ipcRenderer.emit = (channel, event, args...) ->
  ipc.emit channel, args...
  EventEmitter::emit.apply ipcRenderer, arguments

# Deprecated.
for method of ipcRenderer when method.startsWith 'send'
  ipc[method] = ipcRenderer[method]
deprecate.rename ipc, 'sendChannel', 'send'
deprecate.rename ipc, 'sendChannelSync', 'sendSync'

module.exports = ipc
