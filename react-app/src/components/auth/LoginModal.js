/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import { useSearch } from '../../context/Search';
import LoginForm from './LoginForm';

/*************************** COMPONENTS ***************************/
import './LoginSignupModal.css'

/*************************** COMPONENTS ***************************/

function LoginModal({classname}) {
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
        <h3 className={classname} onClick={handleModalClick}>Login</h3>
        {showModal && (
        <Modal onClose={handleModalClose}>
            <LoginForm setShowModal={setShowModal} setModalOpen={setModalOpen}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default LoginModal;