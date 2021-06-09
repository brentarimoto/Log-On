/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";


/*************************** COMPONENT IMPORTS ***************************/
import MessageChat from "./MessageChat/MessageChat";


/*************************** CSS ***************************/
import './MessageBar.css'
import { useDispatch, useSelector } from "react-redux";
import { newNotification, setMessageNotifications } from "../../store/notifications";


/*************************** COMPONENTS ***************************/
function MessageBar({closeMessage, socket}) {
  const dispatch = useDispatch()
  const active = useSelector(state=>state.active)
  const friends = useSelector(state=>state.friends)
  const user = useSelector(state=>state.session.user)
  const messageNotifications = useSelector(state=>state.notifications.messages)
  const friendUpdate = useSelector(state=>state.friendUpdate)

  const [loaded, setLoaded] = useState(false)

  useEffect(()=>{
    const value = JSON.parse(localStorage.getItem('messageNotifications'))
    if(value){
      if(Object.keys(value).length>0){
        dispatch(setMessageNotifications(value))
      }
    }
  },[])

  useEffect(()=>{
    localStorage.setItem('messageNotifications', JSON.stringify(messageNotifications))
  },[messageNotifications])

  if (!user){
      return null
  }


  return (
    <div className='messagebar'>
      {active.length>0 &&
        active.map((message)=>(
          <MessageChat key={message.user_id} messages={message.messages} userId={message.user_id} socket={socket}/>
        ))
      }
    </div>
  );
}

/*************************** EXPORT ***************************/
export default MessageBar;
