const {app, BrowserWindow, ipcMain, Menu} = require('electron')
const menubar = require('menubar')

let pickerDialog
const dir = __dirname
let mb = menubar({
  icon: dir + '/assets/icons/png/32x32.png',
  width:250,
  height:310,
  dir: dir,
  transparent:true,
  skipTaskbar: true,
  tooltip: 'Rectron',
  preloadWindow: true,
  alwaysOnTop: true
})



function changeAlwaysOnTop (menuItem, browserWindow, event) {
  mb.setOption('alwaysOnTop', menuItem.checked)
}

function openDevTools (menuItem, browserWindow, event) {
  mb.window.openDevTools()
}

function quit (menuItem, browserWindow, event) {
  app.quit();
}

mb.on('ready', () => {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Always on top', 
      type: 'checkbox', 
      checked:mb.getOption('alwaysOnTop'), 
      click: changeAlwaysOnTop
    },
    {
      label: 'Open dev tools', 
      type: 'normal', 
      click: openDevTools
    },
    {
      label: 'Quit', 
      type: 'normal', 
      click: quit
    }
  ])
  mb.tray.setContextMenu(contextMenu)

  pickerDialog = new BrowserWindow({
    frame:false,
    transparent:true,
    icon: dir + '/assets/icons/png/32x32.png',
    parent: mb.window,
    skipTaskbar: true,
    modal: true,
    show: false,
    height: 390,
    width: 580
  })
  pickerDialog.loadURL('file://' + __dirname + '/picker.html')
})

ipcMain.on('show-picker', (event, options) => {
  pickerDialog.show()
  pickerDialog.webContents.send('get-sources', options)
})

ipcMain.on('source-id-selected', (event, sourceId) => {
  pickerDialog.hide()
  mb.window.webContents.send('source-id-selected', sourceId)
})
