/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import SignupForm from './SignUpForm';
import { useSearch } from '../../context/Search';

/*************************** COMPONENTS ***************************/
import './LoginSignupModal.css'


/*************************** COMPONENTS ***************************/

function SignupModal({classname}) {
  const [showModal, setShowModal] = useState(false);

  const {setModalOpen} = useSearch()

  const handleModalClick=()=>{
    setShowModal(true)
    setModalOpen(true)
  }

  const handleModalClose=()=>{
    setShowModal(false)
    setModalOpen(false)
  }

  return (
    <>
        <h3 className={classname} onClick={handleModalClick}>Create Account</h3>
        {showModal && (
        <Modal onClose={handleModalClose}>
            <SignupForm setShowModal={setShowModal} setModalOpen={setModalOpen}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default SignupModal;