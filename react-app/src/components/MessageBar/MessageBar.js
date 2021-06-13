/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";


/*************************** COMPONENT IMPORTS ***************************/
import MessageChat from "./MessageChat/MessageChat";


/*************************** CSS ***************************/
import './MessageBar.css'
import { useDispatch, useSelector } from "react-redux";
import { setMessageNotifications } from "../../store/notifications";

/*************************** HELPER FUNCTION ***************************/
function messageHash(userId, friendId){
  return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}


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
  },[dispatch])

  useEffect(()=>{
    if(!loaded && Object.keys(friends).length){
      if(Object.keys(friends).length>0){
        for (let id in friends) {
            socket.emit('join', {room:messageHash(friends[id].accept_id, friends[id].request_id)})
          }
      }
      setLoaded(true)
    }

    if(friendUpdate.new){
      socket.emit('join', {room:messageHash(user.id, friendUpdate.new)})
    }

    if(friendUpdate.un){
      socket.emit('leave', {room:messageHash(user.id, friendUpdate.un)})
    }

  },[friends, friendUpdate])

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
