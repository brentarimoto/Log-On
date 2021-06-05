/*************************** REACT IMPORTS ***************************/

import React, { useEffect } from "react";
import { io } from "socket.io-client";


/*************************** COMPONENT IMPORTS ***************************/
import MessageChat from "./MessageChat/MessageChat";
import {addMessage} from '../../store/messages'


/*************************** CSS ***************************/
import './MessageBar.css'
import { useDispatch, useSelector } from "react-redux";
import { newMessageNotification } from "../../store/notifications";

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
  const messages = useSelector(state=>state.messages)

  useEffect(()=>{
    socket = io()
    if(Object.keys(friends).length>0){
      for (let id in friends) {
        socket.on('connect', () => {
          socket.emit('join', {room:messageHash(friends[id].accept_id, friends[id].request_id)})
        })
      }
    }

    socket.on("message", (message) => {
      const userId = message.sender_id!==user.id ? message.sender_id : message.receiver_id
      if (messages[userId]){
        dispatch(addMessage(userId, message))
      } else{
        dispatch(newMessageNotification(userId))
      }
    })

    return (()=>{
      socket.disconnect()
    })
  },[friends])


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
