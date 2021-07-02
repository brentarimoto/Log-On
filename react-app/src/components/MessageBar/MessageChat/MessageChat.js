/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';



/*************************** COMPONENT IMPORTS ***************************/
import Message from "./Message";
import { popActive } from "../../../store/activeMessages";
import { switchActiveOpen, removeActiveOpen } from "../../../store/activeOpen";
import { readMessageNotification } from "../../../store/notifications";

import './MessageChat.css'



/*************************** HELPER FUNCTION ***************************/
import messageHash from '../../../util/messageHash'

/*************************** COMPONENTS ***************************/
function MessageChat({messages, userId, socket}) {
    const [message, setMessage] = useState('')

    const dispatch= useDispatch()
    const inputRef = useRef(null)
	const bottomRef = useRef(null)

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const open = useSelector(state=>state.open)
    const notificationsNum = useSelector(state=>state.notifications.messages[userId])
    const friendship=friends[userId]
    const friend = friendship?.accepter ? friendship?.accepter : friendship?.requester

    useEffect(()=>{
        inputRef.current.focus()
        dispatch(switchActiveOpen(userId))
        return ()=>{
            dispatch(removeActiveOpen(userId))
        }
    },[dispatch])

	useEffect(() => {
		if(bottomRef.current){
			scrollToBottom()
		}
	}, [messages])

	const scrollToBottom = () => {
		bottomRef.current.scrollIntoView({ behavior: "auto" })
	}


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
        if(e.key==='Enter'){
            e.preventDefault()
            if(message.length>0){
                socket.emit("message", {sender_id:user.id,receiver_id:userId,friend_id:friendship.id, message, room:messageHash(userId, user.id)})
                setMessage('')
            }
        }
    }


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
					<div ref={bottomRef}/>
                    {Object.keys(messages).length>0 &&
                        Object.entries(messages).reverse().map(([id, message])=>(
                            <Message key={id} message={message} friend_id={userId}/>
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
