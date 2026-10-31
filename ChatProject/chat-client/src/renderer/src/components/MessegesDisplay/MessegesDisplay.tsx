  import { chatMenegment, group, messege } from '@renderer/ChatManegment';
import './style.css'
  
  import React, { useEffect, useRef, useState } from 'react';
import InputComponent from '../InputSendComponet/InputComponent';


  const g = new group("", "", 0);

  function MessegesDisplay(): React.JSX.Element {
    const [group, setGroup] = useState(g);
    const currentGroupIdRef = useRef(group.groupID);
    const chatMeneg = chatMenegment.getIntance()
    const [messeges, setMesseges] = useState(g.messeges);
    function sendMessege(InputMessege) {

      const messegeObject:messege = {
        messegeKey: 0,
        senderNickname: chatMeneg.nickname,
        messege: InputMessege,
        isMe: true
      }
      group.addMessege(messegeObject);
      setMesseges((prev) => [messegeObject, ...prev]);

      if (group.isUserChat) {
        const NewMessege = {
          source: chatMeneg.ID,
          target: group.groupID,
          type: 0, // messege User
          sender: chatMeneg.nickname,
          messege: InputMessege
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
          messege: InputMessege
        }
        console.log("writing to server in renderer ", NewMessege)
        window.electron.send("writeDataToServer", NewMessege);
      }
    }
    useEffect(()=> {
      const unsubscribe = window.electron.listenIncomingMesseges((newMessege) => {
        let M = newMessege[0];
        const messegeObject:messege = {
          messegeKey: 0,
          senderNickname: M.sender,
          messege: M.messege,
          isMe: false
        }
        const conversationID = M.type === 0 ? M.source : M.target
        chatMeneg.addMessegeToGroup(conversationID, messegeObject)

        if (conversationID == currentGroupIdRef.current) {
          setMesseges((prev) => [messegeObject, ...prev])
        }
      })
      function handleChangeChat(data) {
        console.log("in the EventListener ", data['detail'])
        setGroup(data['detail'])
        setMesseges(data['detail'].messeges)
        currentGroupIdRef.current = data['detail'].groupID;

      }
      window.addEventListener('change-chat', handleChangeChat);
        
      
    }, [])
    
    return (
    <>
          <div className='MessegeDisplay'>

          {messeges.map(key => (
            <div key={key.messegeKey}>
              sender: {key.senderNickname}
              messege: {key.messege}
            </div>
          ))}
          </div>
          <InputComponent group={group} click={sendMessege}/>
      </>
  
    )
  }
  
  export default MessegesDisplay
  
