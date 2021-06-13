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

function UserSearchModal({user, setSearch, setSearchResults, classname,socket}) {
  const dispatch = useDispatch()
  const users=useSelector(state=>state.users)

  const [showModal, setShowModal] = useState(false);


  const handleSearchClick = async()=>{
    await dispatch(getUser(user.id))
    setShowModal(true)
  }

  const handleSearchClose = ()=>{
    if (setSearch){
      setSearch('')
      setSearchResults([])
    }
    setShowModal(false)
  }

  return (
    <>
        <div className={`${classname}__search-item`} onClick={handleSearchClick}>
            <div className={`${classname}__search-photo`}>
                    <ProfilePhoto profileUser={user}/>
            </div>
            <p className={`${classname}__search-username`}>{user.username}</p>
            <div className={`${classname}__search-extra`}>
              {classname==='friendspage' &&
              <p className={`${classname}__search-name`}>{user.firstname} {user.lastname}</p>
              }
                <p className={`${classname}__search-email`}> {user.email}</p>
            </div>
        </div>
        {showModal && (
        <Modal onClose={handleSearchClose}>
            <User setShowModal={setShowModal} profileUserId={user.id} socket={socket}/>
        </Modal>
        )}
    </>
  );
}


/*************************** EXPORT ***************************/

export default UserSearchModal;