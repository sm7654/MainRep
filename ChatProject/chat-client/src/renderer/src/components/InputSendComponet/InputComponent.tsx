
  import { chatMenegment, group, messege } from '@renderer/ChatManegment';
import './style.css'
  
  import React, { useEffect, useState } from 'react';



  function InputComponent(): React.JSX.Element {
    
    let [inputMessege, setMessege] = useState("");
    /*
    function sendMessege() {
      const messegeObject:messege = {
        messegeKey: 0,
        senderNickname: chatMeneg.nickname,
        messege: inputMessege,
        isMe: true
      }
      group.addMessege(messegeObject);
      console.log(group.getMesseges())
      setMesseges([{
        messegeKey: 0,
        senderNickname: chatMeneg.nickname,
        messege: inputMessege,
        isMe: true
      }, ...messeges]);
    }*/
    return (
    <>

      </>
  
    )
  }
  
  export default InputComponent
  
