const { app, BrowserWindow, Menu, Tray, nativeImage } = require('electron')
const path = require('path')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

const portSecurity = require('./src/utils/portSecurity.js')
const createKoaServer = require('./src/koaServer/app.js')

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 420,
    height: 280,
    icon: './icon.ico',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
    },
  })
  mainWindow.loadFile('index.html')
  mainWindow.webContents.openDevTools()
  tray = new Tray('./icon.ico')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '打开主界面',
      click: function () {
        mainWindow.show()
      },
    },
    {
      label: '退出',
      click: function () {
        app.exit()
      },
    }
  ])
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    mainWindow.show()
  })
  mainWindow.on('close', function (e) {
    mainWindow.hide()
    e.preventDefault()
  })
  ipc.on('open-dialog', function (event) {
    dialog.showMessageBox({
      title: '调用说明',
      message:
`POST接口：http://127.0.0.1:1006/print/silentPrint
入参: 
{
  "type": "html",
  "content": "<div>hello world</div>",
  "pageSize": "A4",
  "pcs": 1
}`,
      type: 'info'
    })
  })
  createKoaServer(mainWindow)
}
let tray = null
app.whenReady().then(() => {
  createWindow()
  Menu.setApplicationMenu(null) //隐藏菜单栏
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
