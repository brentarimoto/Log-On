/*************************** REACT IMPORTS ***************************/
import React from 'react';


/*************************** CSS ***************************/
import './NotificationBubble.css'

/*************************** COMPONENTS ***************************/
const NotificationBubble = ({notificationsNum, message}) => {

    if (!notificationsNum){
        return null
    }

    if (message){
        return (
            <>
                <i className="fas fa-comment bubble-notification__message-icon"></i>
                <div className='bubble-notification__message'>
                    {notificationsNum}
                </div>
            </>
        );
    }

    return (
        <div className='bubble-notification'>
            {notificationsNum}
        </div>
    );
}


/*************************** EXPORT ***************************/
export default NotificationBubble;
