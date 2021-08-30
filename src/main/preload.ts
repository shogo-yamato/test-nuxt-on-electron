import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  on(channel: string, func: any) {
    return ipcRenderer.on(channel, func)
  },
  send(channel: string) {
    return ipcRenderer.send(channel)
  },
  async invoke(channel: string, arg?: any) {
    return await ipcRenderer.invoke(channel, arg)
  },
})
