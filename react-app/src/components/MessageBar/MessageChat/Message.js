/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage } from "../../../store/messages";
import ProfilePhoto from "../../ProfilePhoto/ProfilePhoto";



/*************************** COMPONENT IMPORTS ***************************/
import './Message.css'


/*************************** HELPER COMPONENT ***************************/

function DeleteIcon({deleteOpen,setDeleteOpen, message}){
    const dispatch = useDispatch()
    const user = useSelector(state=>state.session.user)

    let friend_id;

    if (message.friendship){
        friend_id = message.friendship.accept_id!==user.id ? message.friendship.accept_id : message.friendship.request_id
    }

    const [deleteConfirmation, setDeleteConfirmation] = useState(false)


    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = (e)=>{
        if(!/^message__delete-icon/.test(e.target.className)){
            setDeleteOpen(false)
            setDeleteConfirmation(false)
        }
    }

    const handleConfirmOpen = ()=>{
        setDeleteConfirmation(true)
    }

    const handleDelete = ()=>{
        if(friend_id){
            dispatch(deleteMessage(message.id, friend_id))
        }
    }

    return(
        <div className={`message__delete ${deleteConfirmation && 'message__delete-confirmation'}`} style={{display: deleteOpen && 'flex'}} onClick={deleteConfirmation ? handleDelete : handleConfirmOpen}>
            {deleteConfirmation ?
            <i className="message__delete-icon fas fa-minus"></i> :
            <i className="message__delete-icon-confirmation fas fa-trash-alt"></i>}
        </div>
    )

}

/*************************** COMPONENTS ***************************/
function Message({message}) {
    const user = useSelector(state=>state.session.user)
    const friends = useSelector(state=>state.friends)
    const friend = friends[message.sender.id]?.accepter || friends[message.sender.id]?.requester
    const isUser = message.sender.id===user.id

    const [deleteOpen, setDeleteOpen] = useState(false)

    const handleDeleteOpen = (e)=>{
        if(!e.target.className.includes('message__delete')){
            setDeleteOpen(prev=>!prev)
        }
    }

    return (
        <div className={isUser ? 'message message--user' : 'message message--friend'}>
            <div className='message__profpic'>
                <ProfilePhoto profileUser={message.sender.id===user.id ? user : friend}/>
            </div>
            <div className={isUser ? 'message__text message__text--user' : 'message__text message__text--friend'} onClick={handleDeleteOpen}>
                {message.message}
                {(isUser && message.friendship) &&
                <DeleteIcon deleteOpen={deleteOpen} setDeleteOpen={setDeleteOpen} message={message}/>
                }
            </div>
        </div>
    );
}

/*************************** EXPORT ***************************/
export default Message;
