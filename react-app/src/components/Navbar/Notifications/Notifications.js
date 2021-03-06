/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import ProfilePhoto from '../../ProfilePhoto/ProfilePhoto';
import { deleteNotification, resetNormalNotifications, setNotifications } from '../../../store/notifications';
import { joinRoom } from '../../../store/rooms';

/*************************** CSS ***************************/
import './Notifications.css'
import { acceptRequest } from '../../../store/friends';
import { newFriendUpdate } from '../../../store/friendUpdate';

/*************************** INNER COMPONENTS ***************************/
const NoNotificationItem = ()=>{
    return(
        <div className='notification__list-none noselect'>
            <h3 className='notification__list-none'>No Notifications!</h3>
        </div>
    )
}

const NotificationItem = ({notification,setNotificationOpen, socket})=>{
    const dispatch = useDispatch()
    const location = useLocation()

    const user= useSelector(state=>state.session.user)

    const handleNotificationClick=(e)=>{
        if(e.target.className.includes('delete')){
            e.preventDefault()
            return
        }
        dispatch(joinRoom(notification.hash, notification.sender))
        dispatch(deleteNotification(notification.hash))
        setNotificationOpen(false)
    }

    const handleDeleteNotification = (e)=>{
        dispatch(deleteNotification(notification.hash))
        setNotificationOpen(false)
    }

    const handleAccept= ()=>{
        (async()=>{
            await dispatch(acceptRequest(notification.sender.id))
            await dispatch(newFriendUpdate(notification.sender.id))
            socket.emit('accept_request', {sender_id:user.id, friend_id:notification.sender.id, room:`User:${notification.sender.id}`})
            socket.emit('online')
            dispatch(deleteNotification(notification.hash))
            setNotificationOpen(false)
        })()
    }

    let link;

    if (notification.game){
        link = `/games/${notification.game.id}/${notification.hash}`
    } else if (notification.error){
        link = location.pathname
    }

    if (notification.request){
        return(
            <div className='notification__list-item'>
                 <div className='notification__list-item-profpic'>
                    <ProfilePhoto profileUser={notification.sender}/>
                </div>
                <div className='notification__list-item-name'>
                    {notification.sender.username}
                </div>
                <div className='notification__list-item-text'>
                    {notification.text}
                    <button className='notification__list-item-accept' onClick={handleAccept}>
                        <i className="fas fa-user-plus user_info-icon"></i>
                        Accept Request
                    </button>
                </div>
                <div className='notification__list-item-delete' onClick={handleDeleteNotification}>
                    <i className="notification__list-item-delete-icon fas fa-trash"></i>
                </div>
            </div>
        )
    }

    return(
        <Link className='notification__list-item' to={link} onClick={handleNotificationClick}>
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

const NotificationList = ({setNotificationOpen, socket}) =>{
    const dispatch = useDispatch()
    const notifications = useSelector(state=>state.notifications.notifications)


    useEffect(() => {
        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleClick = (e)=>{
        if(!/^notification/.test(e.target.className)){
            setNotificationOpen(false)
        } else if(e.target.className.includes('notification__list-item')){
            document.removeEventListener("mousedown", handleClick);
        }
    }

    const handleClear = ()=>{
        dispatch(resetNormalNotifications())
        setNotificationOpen(false)
    }

    return(
        <div className='notification__list'>
            <div className='notification__clear-div'>
                <div className='notification__header'>Notifications</div>
                <div className='notification__clear' onClick={handleClear}>Clear</div>
            </div>
            {notifications.length>0 ?
            notifications.map((notification, id)=>(
                <NotificationItem key={`${id}-${notification.hash}`} notification={notification} none={true} setNotificationOpen={setNotificationOpen} socket={socket}/>
            )) :
            <NoNotificationItem />
            }
        </div>
    )

}


/*************************** COMPONENTS ***************************/
const Notifications = ({notification}) => {
    const dispatch = useDispatch()

    const notifications = useSelector(state=>state.notifications.notifications)
    const socket = useSelector(state=>state.socket)

    const [notificationOpen, setNotificationOpen] = useState(false)

    const handleClick = ()=>{
        setNotificationOpen(prev=>!prev)
    }

    useEffect(()=>{
        const value=  JSON.parse(localStorage.getItem('notifications'))
        if(value?.length){
            dispatch(setNotifications(value))
        }
    },[dispatch])

    useEffect(()=>{
        localStorage.setItem('notifications', JSON.stringify(notifications))
    },[notifications])

    return (
        <div className='notification'>
            <i className="notification__icon fas fa-bell" onClick={handleClick}></i>
            {notificationOpen && <NotificationList setNotificationOpen={setNotificationOpen} socket={socket}/>}
        </div>
    );
}


/*************************** EXPORT ***************************/
export default Notifications;
