/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import User from './User';

/*************************** COMPONENTS ***************************/
import './UserModal.css'

/*************************** COMPONENTS ***************************/

function LoginModal({friend}) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
        <ProfilePhoto profileUser={friend} onClick={()=>setShowModal(true)}/>
        {showModal && (
        <Modal onClose={()=>setShowModal(false)}>
            <User setShowModal={setShowModal} profileUser={friend}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default LoginModal;