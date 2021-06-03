/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import LoginForm from './LoginForm';

/*************************** COMPONENTS ***************************/
import './LoginSignupModal.css'

/*************************** COMPONENTS ***************************/

function LoginModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
        <h3 className='navbar__modal-button' onClick={() => setShowModal(true)}>Login</h3>
        {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <LoginForm setShowModal={setShowModal}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default LoginModal;