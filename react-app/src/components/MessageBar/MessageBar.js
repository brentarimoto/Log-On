/*************************** REACT IMPORTS ***************************/

import React, { useEffect } from "react";
import { io } from "socket.io-client";


/*************************** COMPONENT IMPORTS ***************************/
import MessageChat from "./MessageChat/MessageChat";


/*************************** CSS ***************************/
import './MessageBar.css'
import { useSelector } from "react-redux";

let socket;


/*************************** HELPER FUNCTION ***************************/
function messageHash(userId, friendId){
  return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}


/*************************** COMPONENTS ***************************/
function MessageBar({closeMessage}) {
  const active = useSelector(state=>state.active)
  const friends = useSelector(state=>state.friends)

  useEffect(()=>{
    socket = io()
    if(Object.keys(friends).length>0){
      for (let id in friends) {
        socket.on('connect', () => {
          socket.emit('join', {room:messageHash(friends[id].accept_id, friends[id].request_id)})
        })
      }
    }
    return (()=>{
      socket.disconnect()
    })
  },[friends])


  return (
    <div className='messagebar'>
      {active.length>0 &&
        active.map((message)=>(
          <MessageChat key={message.user_id} closeMessage={closeMessage} messages={message.messages} userId={message.user_id} socket={socket}/>
        ))
      }
    </div>
  );
}

/*************************** EXPORT ***************************/
export default MessageBar;
