/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef } from 'react';


/*************************** COMPONENT IMPORTS ***************************/

/*************************** CSS ***************************/
import './ProfilePhoto.css'

/*************************** COMPONENTS ***************************/
const ProfilePhoto = ({profileUser, onClick}) => {
    return (
        <div className='profile-photo' onClick={onClick}>
            {profileUser?.profile_photo ?
            <img className='profile-photo__pic' src={profileUser?.profile_photo} alt='profile-photo'/> :
            <i class="fas fa-user profile-photo__pic-default"></i>
            }
        </div>
    );
}


/*************************** EXPORT ***************************/
export default ProfilePhoto;
