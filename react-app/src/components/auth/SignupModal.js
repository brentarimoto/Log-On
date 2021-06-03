/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import SignupForm from './SignUpForm';

/*************************** COMPONENTS ***************************/
import './LoginSignupModal.css'


/*************************** COMPONENTS ***************************/

function SignupModal() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
        <h3 className='navbar__modal-button' onClick={() => setShowModal(true)}>Create Account</h3>
        {showModal && (
        <Modal onClose={() => setShowModal(false)}>
            <SignupForm setShowModal={setShowModal}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default SignupModal;