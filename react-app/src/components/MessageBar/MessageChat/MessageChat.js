/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';



/*************************** COMPONENT IMPORTS ***************************/
import Message from "./Message";
import { popActive, updateActive } from "../../../store/activeMessages";
import { switchActiveOpen, removeActiveOpen } from "../../../store/activeOpen";
import { newMessageNotification, readMessageNotification } from "../../../store/notifications";

import './MessageChat.css'



/*************************** HELPER FUNCTION ***************************/
function messageHash(userId, friendId){
    return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}

/*************************** COMPONENTS ***************************/
function MessageChat({closeMessage, messages, userId, socket}) {
    const [messageOpen, setMessageOpen]=useState(true)
    const [message, setMessage] = useState('')
    const [initialLoad, setInitialLoad] = useState(true)
    const [temp, setTemp] = useState([])

    const dispatch= useDispatch()
    const inputRef = useRef(null)

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const active = useSelector(state=>state.active)
    const open = useSelector(state=>state.open)
    const notificationsNum = useSelector(state=>state.notifications.messages[userId])
    const friendship=friends[userId]
    const friend = friendship?.accepter ? friendship?.accepter : friendship?.requester


    const handleMessageClick=(e)=>{
        if(!open[userId] && notificationsNum && !e.target.className.includes('cancel')){
            dispatch(readMessageNotification(userId))
        }
        if(open[userId]){
            inputRef.current.blur()
        } else{
            inputRef.current.focus()
        }
        dispatch(switchActiveOpen(userId))
    }

    const handleMessageCancel=()=>{
        dispatch(popActive(userId))
    }

    const onEnterPress =(e)=>{
        if(e.key=='Enter'){
            e.preventDefault()
            if(message.length>0){
                socket.emit("message", {sender_id:user.id,receiver_id:userId,friend_id:friendship.id, message, room:messageHash(userId, user.id)})
                setMessage('')
            }
        }
    }

    useEffect(()=>{
        inputRef.current.focus()
        dispatch(switchActiveOpen(userId))
        return ()=>{
            dispatch(removeActiveOpen(userId))
        }
    },[])

    return (
    <div className='messagechat__div'>
        <div className={`messagechat ${open[userId] && 'messagechat--active'}`}>
            <div className={`messagechat__username ${notificationsNum>0 && 'messagechat__username--notification'}`}onClick={handleMessageClick}>
                <p>{friend.username}</p>
                <div className='messagechat__cancel' onClick={handleMessageCancel}>
                    <i className="fas fa-times cancel"></i>
                </div>
                {notificationsNum>0 &&
                    <div className='messagechat__notifications'>
                        {notificationsNum}
                    </div>
                }
            </div>
            <div className='messagechat__chat-div'>
                <div className='messagechat__chat'>
                    {Object.keys(messages).length>0 &&
                        Object.entries(messages).reverse().map(([id, message])=>(
                            <Message key={id} message={message}/>
                        ))
                    }
                </div>
            </div>
            <div className='messagechat__input-div'>
                <textarea
                    ref={inputRef}
                    className='messagechat__input'
                    value={message}
                    onChange={(e)=>setMessage(e.target.value)}
                    onKeyDown={onEnterPress}
                ></textarea>
            </div>
        </div>
    </div>
    );
}

/*************************** EXPORT ***************************/
export default MessageChat;
