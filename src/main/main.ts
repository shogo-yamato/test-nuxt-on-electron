// courtesy of https://github.com/282Haniwa/nuxt-electron-example/blob/master/src/main/index.ts

import { pathToFileURL, fileURLToPath } from 'url'
import { get, createServer } from 'http'
import path from 'path'
import fs from 'fs'
import { app, BrowserWindow, dialog, ipcMain, Menu } from 'electron'
// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
import { AddressInfo } from 'node:net'
import { IncomingMessage } from 'node:http'
import nuxtConfig from '../renderer/nuxt.config'
import { Image } from '../renderer/types/custom-types'

nuxtConfig.rootDir = path.resolve('src/renderer')

const isDev = nuxtConfig.dev
const nuxt = new Nuxt(nuxtConfig)
const builder = new Builder(nuxt)
const server = createServer(nuxt.render)

let _NUXT_URL_ = ''

if (isDev) {
  /* eslint-disable no-console */
  builder.build().catch((error: any) => {
    console.error(error)
    process.exit(1)
  })
  server.listen()
  const { port } = server.address() as AddressInfo
  _NUXT_URL_ = `http://localhost:${port}`
  console.log(`Nuxt working on ${_NUXT_URL_}`)
  /* eslint-enable */
} else {
  _NUXT_URL_ = pathToFileURL(
    path.resolve(__dirname, '../../dist/nuxt-build/index.html')
  ).toString()
}

function pollServer(): void {
  get(_NUXT_URL_, (res: IncomingMessage) => {
    if (res.statusCode !== 200) {
      // eslint-disable-next-line no-console
      console.log('restart pollServer')
      setTimeout(pollServer, 300)
    }
  }).on('error', pollServer)
}

async function createWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 1400,
    height: 1000,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev,
    },
  })
  if (isDev) {
    const {
      default: installExtension,
      VUEJS_DEVTOOLS,
    } = require('electron-devtools-installer')
    /* eslint-disable no-console */
    try {
      const name = await installExtension(VUEJS_DEVTOOLS.id)
      console.log(`Added Extension: ${name}`)
    } catch (error: any) {
      console.error(`An error occurred: ${error}`)
    }
    /* eslint-enable */
    pollServer()
  }
  await window.loadURL(_NUXT_URL_)
  if (isDev) window.webContents.openDevTools()
}

// const count = 0

Menu.setApplicationMenu(
  Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        {
          label: 'New',
          click() {
            console.log('NEW MENU')
            createDummyWindow()
          },
        },
        {
          label: 'File',
          click() {
            console.log('FILE MENU')
            createDummyWindow()
          },
        },
        {
          label: 'ALIGN ALL WINDOWS',
          click() {
            // const focusedWindow = BrowserWindow.getFocusedWindow()
            // focusedWindow?.webContents.send(
            //   'hello-from-menu',
            //   `message from menu / count: ${++count}`
            // )
            const windows = BrowserWindow.getAllWindows()
            windows.reverse().forEach((window, index): void => {
              window.setPosition(100 + 150 * index, 100 + 50 * index)
              window.moveTop()
              window.webContents.send(
                'align-all-windows',
                `This is window No.${index + 1}`
              )
            })
          },
        },
        { role: 'close' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      label: 'Help',
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'reload' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
      ],
    },
  ])
)

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// NOTE:
// Dev環境のとき、
// アプリ終了時にDevサーバーを終了
// close()関数については以下参照
// https://github.com/nuxt/nuxt.js/blob/0145578493a123ee0ff0e9adc4921582d456d366/packages/builder/src/builder.js#L775
app.on('will-quit', () => {
  if (isDev) builder.close()
})

const windowName: string[] = ['ばなな', 'おれんじ', 'あっぷる']

// ipcMain.on('hello-to-main', (event: IpcMainEvent): void => {
//   const dummyWindowId = createDummyWindow()
//   event.reply(
//     'hello-from-main',
//     `${windowName[dummyWindowId % 3]}-${dummyWindowId}`
//   )
// })

function createDummyWindow(): number {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: !isDev,
    },
  })
  window.loadURL(_NUXT_URL_)
  return window.id
}

ipcMain.handle('open-dummy-window', (_): string => {
  const dummyWindowId = createDummyWindow()
  return `${windowName[dummyWindowId % 3]}-${dummyWindowId}`
})

ipcMain.handle('close-other-windows', (_): string | void => {
  const currentWindow = BrowserWindow.getFocusedWindow()
  if (!currentWindow) return
  BrowserWindow.getAllWindows().forEach((window) => {
    if (window.id !== currentWindow.id) window.close()
  })
  return `ID of the remaining window is: ${currentWindow.id}`
})

// ipcMain.handle('get-sample-text', (_): string | void => {
//   return fs.readFileSync(path.resolve(__dirname, '../../sample.txt'), 'utf8')
// })

// ipcMain.handle('get-sample-text-async', async (_): Promise<string | void> => {
//   try {
//     return await new Promise((resolve, reject) => {
//       fs.readFile(
//         path.resolve(__dirname, '../../sample-3.txt'),
//         'utf8',
//         (error, data): string | void => {
//           if (error) return reject(error)
//           return resolve(data)
//         }
//       )
//     })
//   } catch (error) {
//     const window = BrowserWindow.getFocusedWindow()
//     if (!window) return 'Failed to load file.'
//     showErrorDialog(window, error)
//     return undefined
//   }
// })

ipcMain.handle(
  'get-text-from-dialog-async',
  async (_): Promise<string | undefined> => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return undefined
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile'],
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    })
    if (result.canceled) {
      // NOTE:
      // 不必要だが練習目的でモーダルを表示
      showCanceledDialog(window)
      return undefined
    }
    try {
      return await new Promise((resolve, reject) => {
        fs.readFile(result.filePaths[0], 'utf8', (error, data): void => {
          if (error) return reject(error)
          return resolve(data)
        })
      })
    } catch (error: any) {
      showErrorDialog(window, error)
      return undefined
    }
  }
)

ipcMain.handle(
  'save-text-from-textarea-async',
  async (_, text: string): Promise<void> => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return
    const result = await dialog.showSaveDialog(window, {
      filters: [{ name: 'Text Files', extensions: ['txt'] }],
    })
    if (result.canceled) {
      // NOTE:
      // 不必要だが練習目的でモーダルを表示
      return showCanceledDialog(window)
    }
    if (result.filePath)
      fs.writeFile(result.filePath, text, (error) => {
        error ? showErrorDialog(window, error) : showFinishedDialog(window)
      })
  }
)

ipcMain.handle('get-images-from-dialog', (_): Image[] | undefined => {
  const window = BrowserWindow.getFocusedWindow()
  if (!window) return undefined
  const files = dialog.showOpenDialogSync(window, {
    properties: ['openFile', 'multiSelections'],
    filters: [
      {
        name: 'Images',
        extensions: ['jpg', 'png', 'gif'],
      },
    ],
  })
  return (
    files?.map((filePath) => ({
      path: pathToFileURL(filePath).toString(),
      name: path.basename(filePath),
      checked: false,
    })) ?? undefined
  )
})

ipcMain.handle(
  'get-images-from-dialog-async',
  async (_): Promise<Image[] | undefined> => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return undefined
    const result = await dialog.showOpenDialog(window, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        {
          name: 'Images',
          extensions: ['jpg', 'png', 'gif'],
        },
      ],
    })
    if (result.canceled) {
      // NOTE:
      // 不必要だが練習目的でモーダルを表示
      showCanceledDialog(window)
      return undefined
    }
    return (
      result.filePaths.map((filePath) => ({
        path: pathToFileURL(filePath).toString(),
        name: path.basename(filePath),
        checked: false,
      })) ?? undefined
    )
  }
)

ipcMain.handle(
  'copy-images-to-different-directory',
  async (_, images: Image[]) => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return
    const folderPath = path.resolve(
      app.getPath('desktop'),
      'images-demo',
      `copied-${new Date().toISOString()}`
    )
    try {
      await new Promise<void>((resolve, reject) =>
        fs.mkdir(folderPath, { recursive: true }, (error) =>
          error ? reject(error) : resolve()
        )
      )
      await Promise.all(
        images.map((image) => {
          return new Promise<void>((resolve, reject) =>
            fs.copyFile(
              fileURLToPath(image.path),
              path.resolve(folderPath, image.name),
              (error) => (error ? reject(error) : resolve())
            )
          )
        })
      )
    } catch (error) {
      return showErrorDialog(window, error)
    }
    showFinishedDialog(window)
  }
)

ipcMain.handle(
  'move-images-to-different-directory',
  async (_, images: Image[]) => {
    const window = BrowserWindow.getFocusedWindow()
    if (!window) return
    const folderPath = path.resolve(
      app.getPath('desktop'),
      'images-demo',
      `moved-${new Date().toISOString()}`
    )
    try {
      await new Promise<void>((resolve, reject) =>
        fs.mkdir(folderPath, { recursive: true }, (error) =>
          error ? reject(error) : resolve()
        )
      )
      await Promise.all(
        images.map((image) => {
          return new Promise<void>((resolve, reject) =>
            fs.rename(
              fileURLToPath(image.path),
              path.resolve(folderPath, image.name),
              (error) => (error ? reject(error) : resolve())
            )
          )
        })
      )
    } catch (error) {
      return showErrorDialog(window, error)
    }
    showFinishedDialog(window)
  }
)

function showFinishedDialog(window: BrowserWindow): void {
  dialog.showMessageBox(window, { type: 'none', message: 'できた☺️' })
}

function showCanceledDialog(window: BrowserWindow): void {
  dialog.showMessageBox(window, {
    type: 'error',
    title: '残念！',
    message: '残念！キャンセルされましたわ🥺',
  })
}

function showErrorDialog(window: BrowserWindow, error: any): void {
  dialog.showMessageBox(window, {
    type: 'error',
    title: 'すんません...',
    message: `すんません...エラーですわ😭
    ${error.code} ${error.errno}`,
    detail: error.message,
  })
}
