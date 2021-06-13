/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';


/*************************** OTHER FILE IMPORTS ***************************/
import User from './User';
import { Modal } from '../../context/Modal';
import { getUser } from '../../store/users';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import { deleteNotification } from '../../store/notifications';

/*************************** COMPONENTS ***************************/
import './UserNotificationModal.css'

/*************************** COMPONENTS ***************************/

function UserNotificationModal({notification, setNotificationOpen, handleDeleteNotification, socket}) {
  const dispatch = useDispatch()

  const [showModal, setShowModal] = useState(false);


  const handleNotificationClick = async()=>{
    await dispatch(getUser(notification.sender.id))
    setShowModal(true)
  }

  const handleClose = async ()=>{
    await dispatch(deleteNotification(notification.hash))
    setShowModal(false)
    setNotificationOpen(false)
  }


  return (
    <>
        <div className='notification__list-item' onClick={handleNotificationClick}>
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
        </div>
        {showModal && (
        <Modal onClose={handleClose}>
            <User setShowModal={setShowModal} profileUserId={notification.sender.id} socket={socket}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default UserNotificationModal;