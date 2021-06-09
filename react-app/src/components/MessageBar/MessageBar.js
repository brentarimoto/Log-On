/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";


/*************************** COMPONENT IMPORTS ***************************/
import MessageChat from "./MessageChat/MessageChat";
import {handleNewSocketMessage} from '../../store/messages'


/*************************** CSS ***************************/
import './MessageBar.css'
import { useDispatch, useSelector } from "react-redux";
import { newNotification, setMessageNotifications } from "../../store/notifications";


/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** HELPER FUNCTION ***************************/
function messageHash(userId, friendId){
  return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}


/*************************** COMPONENTS ***************************/
function MessageBar({closeMessage}) {
  const dispatch = useDispatch()
  const active = useSelector(state=>state.active)
  const friends = useSelector(state=>state.friends)
  const user = useSelector(state=>state.session.user)
  const notifications = useSelector(state=>state.notifications.notifications)
  const messageNotifications = useSelector(state=>state.notifications.messages)
  const friendUpdate = useSelector(state=>state.friendUpdate)

  const [loaded, setLoaded] = useState(false)
  const [currentSocket, setCurrentSocket] = useState(null)

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

  useEffect(()=>{
    socket = io()

    if(!loaded && Object.keys(friends).length){
      socket.on('connect', () => {
        if(Object.keys(friends).length>0){
          for (let id in friends) {
              socket.emit('join', {room:messageHash(friends[id].accept_id, friends[id].request_id)})
            }
          }
      })

      setLoaded(true)
    }

    if(friendUpdate.new){
      socket.emit('join', {room:messageHash(user.id, friendUpdate.new)})
    }

    if(friendUpdate.un){
      socket.emit('leave', {room:messageHash(user.id, friendUpdate.un)})
    }

    socket.on("message", (message) => {
      dispatch(handleNewSocketMessage(message, user))
    })

    socket.on("invitations", ({invitation}) => {
      if ((invitation.sender.id !== user.id)){
        dispatch(newNotification(invitation))
      }
    })

    return ()=>{
      socket.disconnect()
    }
  },[friends, friendUpdate])


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
