
import { useEffect, useState } from 'react'
import { chatMenegment, group, messege } from '../../ChatManegment'
import './style.css'


  const Group = new group("group1", "efwef", 10);
Group.messeges = [
    new messege("Alice", "Hello everyone!", false),
    new messege("Bob", "Hi Alice!", false),
    new messege("Charlie", "How is everyone doing?", false),
    new messege("Diana", "Doing well, thanks.", false),
    new messege("Ethan", "Glad to hear it.", false),
    new messege("Fiona", "Anyone up for a meetup?", false),
    new messege("George", "I am available this weekend.", false),
    new messege("Hannah", "Saturday works for me.", false),
    new messege("Isaac", "That sounds good.", false),
    new messege("Julia", "See you all then!", false),
  ];


const GroupTwo = new group("group2", "fwefwef", 10);
  GroupTwo.messeges = [
    new messege("Fiona", "Anyone up for a meetup?", false),
    new messege("George", "I am available this weekend.", false),
    new messege("Hannah", "Saturday works for me.", false),
    new messege("Isaac", "That sounds good.", false),
    new messege("Julia", "See you all then!", false),
  ];
  

function Chatboxcomponent(): React.JSX.Element {
  
  let chatMeng = chatMenegment.getIntance();
  const [chatsArray, setChats] = useState(chatMeng.getGroupsMap());
  
  useEffect(() => {

    window.electron.newChatListener((data) => {
      console.log("Got new Chat");
      data = data[0]
      let g = new group(data.source, data.sender, 1);
      g.isUserChat = true
      chatMeng.addGroup(g)
      setChats(chatMeng.getGroupsMap())
    })
    window.electron.listenGroupJoined((data) => {
      
      data = data[0]
      let g = new group(data.GroupID, data.groupName, 1);
      g.isUserChat = false
      chatMeng.addGroup(g)
      setChats(chatMeng.getGroupsMap())
    })

    
  }, [])

  function groupClicked(g:group) {
    let event = new CustomEvent('change-chat', { detail: g })
    window.dispatchEvent(event)
  }
  
    
  return (
    <>
    <div className="chats-container">
      {chatsArray.map((key) => (
        <div key={key.groupID} className="chat-row" onClick={() => groupClicked(key)}>
          
          <div className="chat-left-section">
            <div className='groupImageWraper'>
            {key.isUserChat && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"><path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/></svg>}
            {!key.isUserChat && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16"> <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/></svg>}
            </div>
            <span className="chat-group-name">
              {key.groupName}
            </span>
          </div>

          <div className="chat-right-section">
            {Array.isArray(key.members) ? key.members.length : key.members} 
          </div>

        </div>
      ))}
        </div>
    </>
  )
}

export default Chatboxcomponent
