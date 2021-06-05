/*************************** REACT IMPORTS ***************************/
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


/*************************** OTHER FILE IMPORTS ***************************/
import User from './User';
import { Modal } from '../../context/Modal';
import { getUser } from '../../store/users';
import ProfilePhoto from '../ProfilePhoto/ProfilePhoto';

/*************************** COMPONENTS ***************************/
import './UserSearchModal.css'

/*************************** COMPONENTS ***************************/

function UserSearchModal({user, setSearch, setSearchResults}) {
  const dispatch = useDispatch()
  const users=useSelector(state=>state.users)

  const [showModal, setShowModal] = useState(false);


  const handleSearchClick = async()=>{
    if(!users[user.id]){
      user = await dispatch(getUser(user.id))
    }
    setShowModal(true)
  }

  const handleSearchClose = ()=>{
    setShowModal(false)
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
                <p className='navbar__search-email'>{user.email}</p>
            </div>
        </div>
        {showModal && (
        <Modal onClose={handleSearchClose}>
            <User setShowModal={setShowModal} profileUserId={user.id}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default UserSearchModal;