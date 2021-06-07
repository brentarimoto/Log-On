/*************************** REACT IMPORTS ***************************/

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ProfilePhoto from "../../ProfilePhoto/ProfilePhoto";



/*************************** COMPONENT IMPORTS ***************************/
import './Message.css'


/*************************** HELPER FUNCTION ***************************/

/*************************** COMPONENTS ***************************/
function Message({message}) {
    const user = useSelector(state=>state.session.user)
    const isUser = message.sender.id===user.id
    return (
        <div className={isUser ? 'message message--user' : 'message message--friend'}>
            <div className='message__profpic'>
                <ProfilePhoto profileUser={message.sender}/>
            </div>
            <div className={isUser ? 'message__text message__text--user' : 'message__text message__text--friend'}>
                {message.message}
            </div>
        </div>
    );
}

/*************************** EXPORT ***************************/
export default Message;
