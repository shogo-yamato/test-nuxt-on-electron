import { BrowserWindow, dialog } from 'electron/main'

export function showFinishedDialog(window: BrowserWindow): void {
  dialog.showMessageBox(window, { type: 'none', message: 'できた☺️' })
}

export function showCanceledDialog(window: BrowserWindow): void {
  dialog.showMessageBox(window, {
    type: 'error',
    title: '残念！',
    message: '残念！キャンセルされましたわ🥺',
  })
}

export function showErrorDialog(window: BrowserWindow, error: any): void {
  dialog.showMessageBox(window, {
    type: 'error',
    title: 'すんません...',
    message: `すんません...エラーですわ😭
    ${error.code} ${error.errno}`,
    detail: error.message,
  })
}
