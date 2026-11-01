import { chatMenegment, group, messege } from '@renderer/ChatManegment';
import './style.css'  
import React, { useEffect, useRef, useState } from 'react';


const g = new group("", "", 0);
  function MessegesDisplay(): React.JSX.Element {
  
    console.log("gourp is ", g);
    const [group, setGroup] = useState(g);
    const currentGroupIdRef = useRef("");
    const chatMeneg = chatMenegment.getIntance();
    console.log(g.messeges);
    const [messegesList, setMessegesList] = useState(g.messeges);

    useEffect(()=> {
      if (currentGroupIdRef != undefined) {
        setGroup(chatMeneg.getGroup(currentGroupIdRef.current));
        setMessegesList(g.messeges);
        chatMeneg.activeChatID = currentGroupIdRef.current
      }
    }, []);
    
    let [inputMessege, setMessege] = useState("");
    
    function sendMessege() {

      const messegeObject:messege = {
        messegeKey: 0,
        senderNickname: chatMeneg.nickname,
        messege: inputMessege,
        isMe: true
      }
      group.addMessege(messegeObject);
      setMessegesList((prev) => [messegeObject, ...prev]);

      if (group.isUserChat) {
        const NewMessege = {
          source: chatMeneg.ID,
          target: group.groupID,
          type: 0, // messege User
          sender: chatMeneg.nickname,
          messege: inputMessege
        }
        console.log("writing to server in renderer ", NewMessege)
        window.electron.send("writeDataToServer", NewMessege);
      }
      else {
        const NewMessege = {
          source: chatMeneg.ID,
          target: group.groupID,
          type: 1, // messege group
          GroupID: chatMeneg.ID,
          groupName: group.groupName,
          sender: chatMeneg.nickname,
          messege: inputMessege
        }
        console.log("writing to server in renderer ", NewMessege)
        window.electron.send("writeDataToServer", NewMessege);
      }
    }
    useEffect(()=> {
      window.electron.listenIncomingMesseges((newMessege) => {
        let M = newMessege[0];
        const messegeObject:messege = {
          messegeKey: 0,
          senderNickname: M.sender,
          messege: M.messege,
          isMe: false
        }
        const conversationID = M.type === 0 ? M.source : M.target
        chatMeneg.addMessegeToGroup(conversationID, messegeObject)

        if (conversationID == chatMeneg.activeChatID) {
          setMessegesList((prev) => [messegeObject, ...prev])
        }
      })
      function handleChangeChat(data) {
        console.log("in the EventListener ", data['detail'])
        setGroup(data['detail'])
        setMessegesList(data['detail'].messeges)
        currentGroupIdRef.current = data['detail'].groupID;

      }
      window.addEventListener('change-chat', handleChangeChat);
        
      return () => {
        window.electron.removeLisnersNewMessege('new-messege')
      }
      
    }, [])
    
    return (
    <>
        <div className='MessegeDisplay'>

          {messegesList.map(key => (
            <div key={key.messegeKey}>
              sender: {key.senderNickname}
              messege: {key.messege}
            </div>
          ))}
          </div>
          
          <div className='inputSection'>
            <input id='MessegeInput' className='MessegeInput' placeholder="hello" onChange={(e) => {setMessege(e.target.value)}}/>
            <button className='sendButton' onClick={sendMessege}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="whitesmoke" class="bi bi-send-fill" viewBox="0 0 16 16">
              <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
            </svg>
            </button>
          </div>
      </>
  
    )
  }
  
  export default MessegesDisplay