import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  sendHelloToMain() {
    return ipcRenderer.send('hello-to-main')
  },
  receiveHello(channel: string, fn: any) {
    return ipcRenderer.on(channel, fn)
  },
})
