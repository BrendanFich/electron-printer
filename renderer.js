const ipc = require('electron').ipcRenderer
const { remote } = require("electron")
const webContents = remote.getCurrentWebContents()
const printers = webContents.getPrinters()
printers.map((item, index) => {
  //write in the screen the printers for choose
  document.getElementById("list_printers").innerHTML +=
    ' <li>' + item.name + '</li>'
});

const selectDirBtn = document.getElementById('more-btn')

selectDirBtn.addEventListener('click', function (event) {
  ipc.send('open-dialog')
})