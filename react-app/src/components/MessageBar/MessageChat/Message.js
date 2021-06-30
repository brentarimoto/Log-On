/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import messagesReducer, { addMessage, deleteMessage } from "../../../store/messages";
import messageHash from "../../../util/messageHash";
import ProfilePhoto from "../../ProfilePhoto/ProfilePhoto";



/*************************** COMPONENT IMPORTS ***************************/
import './Message.css'


/*************************** HELPER COMPONENT ***************************/

function DeleteIcon({message}){
    const dispatch = useDispatch()
    const user = useSelector(state=>state.session.user)

    let friend_id;

    if (message.friendship){
        friend_id = message.friendship.accept_id!==user.id ? message.friendship.accept_id : message.friendship.request_id
    }

    const [deleteConfirmation, setDeleteConfirmation] = useState(false)

    const handleConfirmOpen = ()=>{
        setDeleteConfirmation(true)
    }

    const handleDelete = ()=>{
        if(friend_id){
            dispatch(deleteMessage(message.id, friend_id))
        }
    }

    return(
        <div className={`message__delete ${deleteConfirmation && 'message__delete-confirmation'}`} onClick={deleteConfirmation ? handleDelete : handleConfirmOpen}>
            {deleteConfirmation ?
            <i className="message__delete-icon fas fa-minus"></i> :
            <i className="message__delete-icon-confirmation fas fa-trash-alt"></i>}
        </div>
    )

}

function EditIcon({message, setEditOn}){
    const dispatch = useDispatch()
    const user = useSelector(state=>state.session.user)

    let friend_id;

    if (message.friendship){
        friend_id = message.friendship.accept_id!==user.id ? message.friendship.accept_id : message.friendship.request_id
    }

    const handleEditOpen = (e)=>{
        setEditOn(true)
    }

    return(
        <div className={`message__edit`} onClick={handleEditOpen}>
            <i className="message__edit-icon fas fa-edit"></i>
        </div>
    )

}

function Options({setOptionsOpen, setEditOn, setCurrentMessage, message}){

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = (e)=>{
        if(!/^message__delete-icon/.test(e.target.className) && !/^message__edit/.test(e.target.className) && !/^message__input/.test(e.target.className)){
            setOptionsOpen(false)
            setEditOn(false)
            setCurrentMessage(message.message)
        }
    }

    return(
        <div className='message__options'>
            <DeleteIcon message={message}/>
            <EditIcon message={message} setEditOn={setEditOn}/>
        </div>
    )
}

/*************************** COMPONENTS ***************************/
function Message({message, friend_id}) {
    const dispatch = useDispatch()


    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const socket = useSelector(state=>state.socket)
    const friend = friends[message.sender_id]?.accepter || friends[message.sender_id]?.requester
    const isUser = message.sender.id===user.id
    // const inputRef = useRef(null)

    const [optionsOpen, setOptionsOpen] = useState(false)
    const [currentMessage, setCurrentMessage] = useState(message.message)
    const [editOn, setEditOn] = useState(false)

    const handleOptionsOpen = (e)=>{
        if(!e.target.className.includes('message__delete')){
            setOptionsOpen(prev=>!prev)
        }
    }

    const onEnterPress =(e)=>{
        if(e.key==='Enter'){
            e.preventDefault()
            if(currentMessage.length>0 && currentMessage!==message.message){
                socket.emit("edit_message", {sender_id:user.id, receiver_id:parseInt(friend_id), id:message.id, message:currentMessage, room:messageHash(parseInt(friend_id), user.id)})
                setEditOn(false)
                setOptionsOpen(false)
            }
        }
    }

    return (
        <div className={isUser ? 'message message--user' : 'message message--friend'}>
            <div className='message__profpic'>
                <ProfilePhoto profileUser={message.sender.id===user.id ? user : friend}/>
            </div>
            <div className={isUser ? 'message__text-div message__text-div--user' : 'message__text-div message__text-div--friend'} style={editOn ? {width:'100%'}:{}}>
                <div className={isUser ? 'message__text message__text--user' : 'message__text message__text--friend'} style={editOn ? {display:'flex', padding: '5px'}:{}}>
                    {editOn &&
                    <textarea
                        // ref={inputRef}
                        className='message__input'
                        value={currentMessage}
                        onChange={(e)=>setCurrentMessage(e.target.value)}
                        onKeyDown={onEnterPress}
                    ></textarea>}
                    {!editOn && message.message}
                    {(isUser && message.friendship) &&
                    <div className="message__options-button" onClick={handleOptionsOpen}><i className="fas fa-ellipsis-v"></i></div>
                    }
                    {optionsOpen &&
                    <Options setOptionsOpen={setOptionsOpen} setEditOn={setEditOn} message={message} setCurrentMessage={setCurrentMessage}/>}
                </div>
            </div>
        </div>
    );
}

/*************************** EXPORT ***************************/
export default Message;
