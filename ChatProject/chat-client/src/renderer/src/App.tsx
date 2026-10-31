import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

import ConnectPage from './components/ConnectPage/ConnectPage'
import ChatsPage from './components/ChatsPage/ChatsPage'
import { Routes, Route, BrowserRouter, useNavigate } from 'react-router-dom';
let x = "";

  const ipcHandle = (event, command:string): void => window.electron.ipcRenderer.send(command, 55)

function typing(event: any) {
  window.electron.ipcRenderer.send("update", event.target.value)
}

function App(): React.JSX.Element {

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<ConnectPage />} />
      <Route path="/chats" element={<ChatsPage />} />
    </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

/*



      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
        &nbsp;and <span className="ts">TypeScript</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={(event) => ipcHandle(event, "ping")}>
            Send IPC
          </a>
          <a target="_blank" rel="noreferrer" onClick={(event) => ipcHandle(event, "test")}>
            print to console
          </a>
          {x}
          <input placeholder='type here' id='input_text' onChange={typing}/>
        </div>
      </div>
      <Versions></Versions>
*/
