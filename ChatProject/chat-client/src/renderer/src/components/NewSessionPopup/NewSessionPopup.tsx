
import './style.css'
import '../ChatsPage/style.css'
import { chatMenegment } from '@renderer/ChatManegment';




function NewSessionPopup(): React.JSX.Element {
  let groupName = "";
  let groupID = "";
  let UserID = "";
  let chatMeneg = chatMenegment.getIntance()
  function switchStates(state:string) {
    const statesSections = document.getElementsByClassName("state");

    for (let index = 0; index < statesSections.length; index += 1) {
      const section = statesSections[index] as HTMLElement
      if (section.id === state) {
        section.classList.remove('hidden')
      } else {
        section.classList.add('hidden')
      }
    }

    const navButtons = document.getElementsByClassName('Navbutton')
    for (let index = 0; index < navButtons.length; index += 1) {
      const button = navButtons[index]
      button.classList.toggle('active', button.id === `${state}-tab`)
    }
  }

  function closePopup(): void {
    document.getElementsByClassName('popupWraper')[0].classList.add('hidden')
  }
  function changeGroupName(event) {
    groupName = event.target.value
  }
  
  function changeGroupID(event) {
    groupID = event.target.value
  }
  
  function changeUserID(event) {
    UserID = event.target.value
  }

  function CreateMessegeUserRequest() {
    
    const messege = {
        source: chatMeneg.ID,
        target: "server",
        type: 2,
        GroupID: "",
        groupName: groupName,
        sender: "",
        messege: ""
    }
    console.log("hello fron new")
    window.electron.send('writeDataToServer', messege);
  }

  return (
    <div className='popupWraper'>
    <div className='sessionPopup'>
      <button
        className='sessionPopupClose'
        onClick={closePopup}
      >
        ×
      </button>
      <nav className='sessionPopupTabs' aria-label='Session actions'>
        <button
          className='active Navbutton'
          id='message-user-tab'
          onClick={() => switchStates('message-user')}
        >
          Message new user
        </button>
        <button
            className='Navbutton'
          id='join-group-tab'
          onClick={() => switchStates('join-group')}
        >
          Join group
        </button>
        <button
        className='Navbutton'
          id='create-group-tab'
          onClick={() => switchStates('create-group')}
        >
          Create group
        </button>
      </nav>

      <section className='state sessionPopupState' id='message-user'>
        <h2>Message a new user</h2>
        <div>
          <label>User ID</label>
          <input id='user-id' placeholder='Enter user ID' onChange={changeUserID} />
          <button>Submit</button>
        </div>
      </section>

      <section className='state sessionPopupState hidden' id='join-group'>
        <h2>Join a group</h2>
        <div>
          <label>Group ID</label>
          <input id='join-group-id' placeholder='Enter group ID' onChange={changeGroupID} />
          <button>Submit</button>
        </div>
      </section>

      <section className='state sessionPopupState hidden' id='create-group'>
        <h2>Create a group</h2>
        <div>
          <label >Group name</label>
          <input id='new-group-name' placeholder='Enter group name' onChange={changeGroupName} />
          <button onClick={CreateMessegeUserRequest}>Submit</button>
        </div>      </section>
    </div>
    </div>
  )
}

export default NewSessionPopup
