/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import ProfilePhoto from '../../ProfilePhoto/ProfilePhoto';
import { deleteGameInvitation, setNotifications } from '../../../store/notifications';
import { joinRoom } from '../../../store/rooms';

/*************************** CSS ***************************/
import './Notifications.css'

/*************************** INNER COMPONENTS ***************************/
const NoNotificationItem = ()=>{
    return(
        <div className='notification__list-item-none noselect'>
            <h3 className='notification__list-item-none'>No Notifications!</h3>
        </div>
    )
}


let socket;

const NotificationItem = ({notification,setNotificationOpen})=>{
    const dispatch = useDispatch()

    const user = useSelector(state=>state.session.user)
    const rooms = useSelector(state=>state.rooms)

    const handleNotificationClick=(e)=>{
        if(e.target.className.includes('delete')){
            e.preventDefault()
            return
        }
        dispatch(joinRoom(notification.hash, notification.sender))
        dispatch(deleteGameInvitation(notification.hash))
        setNotificationOpen(false)
    }

    const handleDeleteNotification = (e)=>{
        dispatch(deleteGameInvitation(notification.hash))
    }

    return(
        <Link className='notification__list-item' to={`/games/${notification.hash}`} onClick={handleNotificationClick}>
             <div className='notification__list-item-profpic'>
                <ProfilePhoto profileUser={notification.sender}/>
            </div>
            <div className='notification__list-item-name'>
                {notification.sender.username}
            </div>
            <div className='notification__list-item-text'>
                {notification.text}
            </div>
            <div className='notification__list-item-delete' onClick={handleDeleteNotification}>
                <i className="notification__list-item-delete-icon fas fa-trash"></i>
            </div>
        </Link>
    )
}

const NotificationList = ({setNotificationOpen}) =>{
    const notifications = useSelector(state=>state.notifications.notifications)

    const handleClick = (e)=>{
        if(!/^notification/.test(e.target.className)){
            setNotificationOpen(false)
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    return(
        <div className='notification__list'>
            {notifications.length>0 ?
            notifications.map((notification)=>(
                <NotificationItem key={notification.hash} notification={notification} none={true} setNotificationOpen={setNotificationOpen}/>
            )) :
            <NoNotificationItem />
            }
        </div>
    )

}


/*************************** COMPONENTS ***************************/
const Notifications = ({notification}) => {
    const dispatch = useDispatch()

    const user = useSelector(state=>state.session.user)
    const notifications = useSelector(state=>state.notifications.notifications)

    const [notificationOpen, setNotificationOpen] = useState(false)

    const handleClick = ()=>{
        setNotificationOpen(prev=>!prev)
    }

    useEffect(()=>{
        const value=  JSON.parse(localStorage.getItem('notifications'))
        if(value?.length){
            dispatch(setNotifications(value))
        }
    },[])

    useEffect(()=>{
        localStorage.setItem('notifications', JSON.stringify(notifications))
    },[notifications])

    return (
        <div className='notification'>
            <i className="notification__icon fas fa-bell" onClick={handleClick}></i>
            {notificationOpen && <NotificationList setNotificationOpen={setNotificationOpen}/>}
        </div>
    );
}


/*************************** EXPORT ***************************/
export default Notifications;
