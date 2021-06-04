/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import UserModal from '../User/UserModal'

/*************************** CSS ***************************/
import './Friend.css'

/*************************** COMPONENTS ***************************/
const Friend = ({friendship}) => {
    const friend = friendship?.accepter ? friendship?.accepter : friendship?.requester

    return (
    <div className='friend'>
        <div className='friend__photo'>
            <UserModal friend={friend} friend_id={friendship.id}/>
        </div>
        <div className='friend__username'>
            {friend?.username}
        </div>
    </div>
    );
}


/*************************** EXPORT ***************************/
export default Friend;
