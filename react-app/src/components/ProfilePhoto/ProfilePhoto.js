/*************************** REACT IMPORTS ***************************/
import React from 'react';


/*************************** COMPONENT IMPORTS ***************************/

/*************************** CSS ***************************/
import './ProfilePhoto.css'

/*************************** COMPONENTS ***************************/
const ProfilePhoto = ({profileUser, onClick}) => {
    return (
        <div className='profile-photo' onClick={onClick}>
            {profileUser?.profile_photo ?
            <img className='profile-photo__pic' src={profileUser?.profile_photo} alt='profile'/> :
            <i className="fas fa-user profile-photo__pic-default"></i>
            }
        </div>
    );
}


/*************************** EXPORT ***************************/
export default ProfilePhoto;
