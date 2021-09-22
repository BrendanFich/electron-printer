const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron')
const path = require('path')

const portSecurity = require('./src/utils/portSecurity.js')
const createKoaServer = require('./src/koaServer/app.js')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 420,
    height: 220,
    icon: nativeImage.createFromPath('./icon.ico'),
    webPreferences: {
      nodeIntegration: true,
    },
  })
  mainWindow.loadFile('index.html')
  // mainWindow.webContents.openDevTools()
  mainWindow.on('close', function (e) {
    e.preventDefault()
    mainWindow.hide()
  })
  let tray = new Tray(nativeImage.createFromPath('./icon.ico'))
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: function () {
        app.exit()
      },
    },
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.show()
  })
  createKoaServer(mainWindow)
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
