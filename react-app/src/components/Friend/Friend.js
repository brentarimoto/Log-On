/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import UserModal from '../User/UserModal'
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import { getMessages } from '../../store/messages';
import { appendActive } from '../../store/activeMessages';

/*************************** CSS ***************************/
import './Friend.css'
import { newMessageNotification, readMessageNotification } from '../../store/notifications';

/*************************** COMPONENTS ***************************/
const Friend = ({friendship}) => {
    const dispatch = useDispatch()
    const friend = friendship?.accepter ? friendship?.accepter : friendship?.requester

    const messages = useSelector(state=>state.messages)
    const active = useSelector(state=>state.active)
    const notificationsNum = useSelector(state=>state.notifications.messages[friend.id])

    const handleMessageOpen =async()=>{
        if (notificationsNum){
            dispatch(readMessageNotification(friend.id))
        }
        if (!messages[friend.id]){
            const messages = await dispatch(getMessages(friendship.id, friend.id))
            dispatch(appendActive(messages))
        } else if(!active.find(el=>el?.user_id===friend.id)){
            dispatch(appendActive({user_id:friend.id,messages:messages[friend.id]}))
        }
    }

    return (
    <div className='friend' onClick={handleMessageOpen}>
        <div className='friend__photo'>
            <UserModal friend={friend} friend_id={friendship.id}/>
            {notificationsNum>0 && <div className='friend__notifications'>
                {notificationsNum}
            </div>}
        </div>
        <div className='friend__username'>
            {friend?.username}
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Friend;
