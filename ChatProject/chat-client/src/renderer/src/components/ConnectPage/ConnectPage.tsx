import { useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { chatMenegment } from '@renderer/ChatManegment'


interface Irequest {
  SessionID:String,
  Nickname:String
}
const request: Irequest = {
  SessionID: "",
  Nickname: ""
}

function ConnectPage(): React.JSX.Element {
    var nickname = ""
    var ID = ""
    const nav = useNavigate()

    
    function changeID(event) {
      ID = event.target.value
    }

    function changeNickname(event) {
      nickname = event.target.value
    }

    function connectToServer(event) {
      request.SessionID = ID;
      request.Nickname = nickname;
      window.electron.send("writeDataToServer", request)
    }
    
    window.electron.listenConnectionStatus((data) => {
      let intance = chatMenegment.getIntance()
      
      intance.nickname = nickname
      intance.ID = data[0].target
      nav('/chats')
    })

    
    

    
  
  return (
    
    <div className='wraper'>
      
      <h2>Connect To Server</h2>
      <div className='inputs_wraper'>
        <div>
          <label className='titles'>Nickname</label>
          <input className='Inputs' type="text" name="nickname" id="" onChange={changeNickname}/>
        </div>
        <div>
          <label className='titles'>User or Group ID</label>
          <input className='Inputs' type="text" name="ID" id="" onChange={changeID} />
        </div>
        <button className='submitButton' type='button' onClick={connectToServer}>connect to server</button>
      </div>
      
    </div>
    
  )
}

export default ConnectPage
