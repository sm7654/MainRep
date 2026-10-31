import { app, shell, BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Socket from 'net'
import { setTimeout } from 'timers'



let counter:number = 0;
var mainWindow;
var UserID = ""
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}




var client:Socket.Socket;
function handleServerData(data: any) {
  console.log(data.type)
  switch (data.type){
      case 2: // createGroup
        break;
      case 3: // leaveGroup
        break;
      case 4: //groupJoined
          mainWindow.send('group-joined', data);
        break;
      case 5: //groupCreated
        break;
      case 7: //ConnectStatus
        if (data.status == 100) { // connection init successfuly
          UserID = data.target
          mainWindow.send('connected', data);
        }
        break;

    defult:
      break;
  }
}
function handleUserData(data: any) {

  switch (data.type){
      case 0: // messegeUser
      case 1: // messegeGroup
        mainWindow.send('new-messege', data)
        break;

      case 6: // newchat
        console.log("new chat created - ", data)
        setTimeout(() => { mainWindow.send('new-chat', data);}, 100);
        break;
      defult: break;
    }
}
async function handleData(data: string) {
  
  let Jdata = JSON.parse(data)
  console.log("the jdata is: ", Jdata)
  if (Jdata.source == "server"){
    console.log("the source is the server")
    handleServerData(Jdata);
  }
  else {
    handleUserData(Jdata);
  }
}
function writeDataToStream(data: any) {
  console.log("writing to server seding - ", data, " or in json - ", JSON.stringify(data));
  const buffer = Buffer.alloc(4);
  let jsonData = JSON.stringify(data);
  buffer.writeUint32LE(jsonData.length, 0);

  client.write(buffer);
  client.write(jsonData);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })






  try {
    client = Socket.connect(5000, "127.0.0.1");
    
} catch{
  }

  client.on('connect', ()=>console.log("success"));
  client.on('error', ()=>console.log("ERROR"));
  // IPC test
  ipcMain.on('ping', () => console.log(counter))
  ipcMain.on('test', (event, cnt: number) => counter += cnt)
  ipcMain.on('update', (event, text:string) => console.log(text))
  ipcMain.on("writeDataToServer", (event, data) => writeDataToStream(data))

  let MainBuffer = Buffer.alloc(0);  
  client.on('data', (data) => {
    MainBuffer = Buffer.concat([MainBuffer, data])
    let messege = Buffer.alloc(0);
    
    while (MainBuffer.length >= 4) {
      length = MainBuffer.readUInt32LE(0)
      
      if (MainBuffer.length < 4 + length){
        break;
      }
      console.log(length);
      messege = Buffer.alloc(length);
      MainBuffer.copy(messege, 0, 4, 4  + length);
      MainBuffer = MainBuffer.subarray(4 + length);  
      handleData(new TextDecoder().decode(messege));
    
    }
    
  });

  createWindow()







  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
