/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';


/*************************** OTHER FILE IMPORTS ***************************/
import { Modal } from '../../context/Modal';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';
import User from './User';

/*************************** COMPONENTS ***************************/
import './UserModal.css'

/*************************** COMPONENTS ***************************/

function UserSearchModal({user, setSearch, setSearchResults}) {
  const [showModal, setShowModal] = useState(false);

  const handleSearchClick = ()=>{
    setShowModal(true)
    setSearch('')
    setSearchResults([])
  }

  return (
    <>
        <div className='navbar__search-item' onClick={handleSearchClick}>
            <div className='navbar__search-photo'>
                    <ProfilePhoto profileUser={user}/>
            </div>
            <p className='navbar__search-username'>{user.username}</p>
            <div className='navbar__search-extra'>
                <p className='navbar__search-email'></p>
                <div className='navbar__search-name'>
                    <p className='navbar__search-firstname'>{user.firstname}</p>
                    <p className='navbar__search-lastname'>{user.lastname}</p>
                </div>
            </div>
        </div>
        {showModal && (
        <Modal onClose={()=>setShowModal(false)}>
            <User setShowModal={setShowModal} profileUser={friend}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default UserSearchModal;