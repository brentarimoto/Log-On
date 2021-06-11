/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import User from './User';

/*************************** COMPONENTS ***************************/
import './UserModal.css'

/*************************** COMPONENTS ***************************/

function UserModal({friend,friend_id, socket}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
        <ProfilePhoto profileUser={friend} onClick={()=>setShowModal(true)}/>
        {showModal && (
        <Modal onClose={()=>setShowModal(false)}>
            <User setShowModal={setShowModal} profileUserId={friend.id} friend_id={friend_id}  socket={socket}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default UserModal;