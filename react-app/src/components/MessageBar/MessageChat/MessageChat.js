/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';



/*************************** COMPONENT IMPORTS ***************************/
import Message from "./Message";
import {addMessage} from '../../../store/messages'
import { popActive, updateActive } from "../../../store/activeMessages";

import './MessageChat.css'



/*************************** HELPER FUNCTION ***************************/
function messageHash(userId, friendId){
    return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}

/*************************** COMPONENTS ***************************/
function MessageChat({closeMessage, messages, userId, socket}) {
    const [messageOpen, setMessageOpen]=useState(false)
    const [message, setMessage] = useState('')
    const [temp, setTemp] = useState([])

    const dispatch= useDispatch()

    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const active = useSelector(state=>state.active)
    const friendship=friends[userId]
    const friend = friendship?.accepter ? friendship?.accepter : friendship?.requester

    // useEffect(()=>{
    //     socket.on('connect', () => {
    //         socket.emit('join', {room:messageHash(user.id, dm)})
    //     })
    // },[])

    useEffect(()=>{
		socket.on("message", (message) => {
            dispatch(addMessage(userId, message))
            if(active.find(el=>el.user_id===friend.id)){
                dispatch(updateActive(friend.id, message))
            }
		})
    },[friends])


    const handleMessageClick=()=>{
        setMessageOpen(prev=>!prev)
        console.log(messageOpen)
    }

    const handleMessageCancel=()=>{
        dispatch(popActive(userId))
    }

    const onEnterPress =(e)=>{
        if(e.key=='Enter'){
            e.preventDefault()
            if(message.length>0){
                socket.emit("message", {sender_id:user.id, friend_id:friendship.id, message, room:messageHash(userId, user.id)})
                setMessage('')
            }
        }
    }

    return (
    <div className='messagechat__div'>
        <div className={`messagechat ${messageOpen && 'messagechat--active'}`}>
            <div className='messagechat__cancel' onClick={handleMessageCancel}>
                <i className="fas fa-times"></i>
            </div>
            <div className='messagechat__username' onClick={handleMessageClick}>
                <p>{friend.username}</p>
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
