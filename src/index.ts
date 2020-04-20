require('dotenv').config()
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
declare const MAIN_WINDOW_WEBPACK_ENTRY: any;
import path from 'path';
import { Searcher, Search } from './downloader/searcher';
import { ZippySearcher } from './downloader/searchers/zippy';
import {Logger} from './logger';
import { Downloader } from './downloader/downloader';

require('update-electron-app')({
  repo: "pthm/tracklist-dl",
  logger: Logger
})

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

let win: BrowserWindow
const searcher = new Searcher()

const createWindow = async () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    title: "tracklist-dl",
    autoHideMenuBar: true,
    height: 800,
    width: 1000,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, "preload.js")
    }
  });
  win = mainWindow
  Logger.setWindow(mainWindow.webContents)

  // and load the index.html of the app.
  await mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  const zippyProvider = new ZippySearcher()
  searcher.registerProvider(zippyProvider)
  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle('APP_CHOOSE_DOWNLOAD_PATH', async (event) => {
  const resp = await dialog.showOpenDialog(win, {
    title: "Choose download location",
    properties: ["openDirectory"]
  })
  console.log("Chosen file", resp.filePaths)

  win.webContents.send('APP_CHOSEN_DOWNLOAD_PATH', {
    paths: resp.filePaths
  })
});

ipcMain.handle('APP_DOWNLOAD_TRACKLIST', async (event, tracklist, path) => {
  const tracks = tracklist.split('\n')
  for (const track of tracks) {
    const search = new Search(searcher)
    const results = await search.search(track)

    const downloader = new Downloader(results, path)
    await downloader.download()
  }
  Logger.log("Complete! :)")
});