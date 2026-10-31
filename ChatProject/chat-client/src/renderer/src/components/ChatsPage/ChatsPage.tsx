import { useEffect, useState } from 'react'
import './style.css'
import {chatMenegment, group, messege} from '../../ChatManegment'
import MessegesDisplay from '../MessegesDisplay/MessegesDisplay'
import Chatboxcomponent from '../chatboxComponent/chatboxcomponent'
import React from 'react';
import NewSessionPopup from '../NewSessionPopup/NewSessionPopup'



function ChatsPage(): React.JSX.Element {
  let chatMeneg = chatMenegment.getIntance()
  function toggleNewSessionPopup() {
    document.getElementsByClassName('popupWraper')[0].classList.remove('hidden')
  }
  useEffect(() => {
    
  }, [])

  
  
  
  return (
    <>
      <NewSessionPopup />
      <div className='chatPageWindow'>
        <section className='chatBoxDisplay'>
          <div className='add_Wraper'>
              <p className='Nickname_text'>{chatMeneg.nickname} : {chatMeneg.ID}</p>
              <button className='AddButtun' onClick={toggleNewSessionPopup}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" className='bi-plus-lg' class="bi bi-plus-lg" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
</svg></button>
          </div>
          <Chatboxcomponent />
        </section>

        <section className='ChatMessegesSection'>
          <div>{}</div>
          <MessegesDisplay />

          
        </section>
      </div>
    </>

  )
}

export default ChatsPage
