import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  on(channel: string, func: any) {
    return ipcRenderer.on(channel, func)
  },
  async invoke(channel: string) {
    return await ipcRenderer.invoke(channel)
  },
})
