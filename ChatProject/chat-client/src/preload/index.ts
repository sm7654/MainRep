import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {}

  contextBridge.exposeInMainWorld('electron', {
    send: (channel,data) => {ipcRenderer.send(channel, data)},

    listenIncomingMesseges: (callback) =>  ipcRenderer.on('new-messege', (e, ...args) => callback(args)),
    
    listenGroupUpdates: (callback) =>  ipcRenderer.on('group-update', (e, ...args) => callback(args)),
    
    listenConnectionStatus: (callback) =>  ipcRenderer.on('connected', (e, ...args) => callback(args)),

    newChatListener: (callback) =>  ipcRenderer.on('new-chat', (e, ...args) => callback(args)),

    listenGroupJoined: (callback) =>  ipcRenderer.on('group-joined', (e, ...args) => callback(args)),


  })
  contextBridge.exposeInMainWorld('api', api)
