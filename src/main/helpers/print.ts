import { BrowserWindow } from 'electron/main'

export function printWindow(window: BrowserWindow): Promise<void> {
  return new Promise((resolve, reject) => {
    window.webContents.print(
      { printBackground: true, margins: { marginType: 'none' } },
      (success, errorType): void => (success ? resolve() : reject(errorType))
    )
  })
}
