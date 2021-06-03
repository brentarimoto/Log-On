/*************************** REACT IMPORTS ***************************/
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";


/*************************** COMPONENT IMPORTS ***************************/
import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";


/*************************** COMPONENTS ***************************/
import './User.css'


/*************************** COMPONENTS ***************************/
function User({profileUser}) {

  const user = useSelector(state=>state.session.user)

  const [firstname, setFirstname] = useState(profileUser.firstname)
  const [lastname, setLastname] = useState(profileUser.lastname)
  const [username, setUsername] = useState(profileUser.username)
  const [email, setEmail] = useState(profileUser.email)
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState([])

  const isUser = user.id==profileUser.id

  // Functions

  const handleSubmit = (e)=>{
    e.preventDefault()
  }

  return (
    <form className='user' onSubmit={handleSubmit}>
      <div className='user__profile-photo'>
          <ProfilePhoto profileUser={profileUser}/>
      </div>
      <div className='user__info-container'>
        <div className='user__info'>
          <div className='user__info-name'>
            <div className='user__info-divs'>
              <label className='user__info-labels' htmlFor="firstname">First Name</label>
              {isUser ?
                <input
                    className='user__info-inputs'
                    name='firstname'
                    type='text'
                    placeholder='First Name'
                    value={firstname}
                    onChange={(e)=>setFirstname(e.target.value)}
                ></input>
                :
                <div className='user__info-text' name='firstname'>{profileUser.firstname}</div>
              }
            </div>
            <div className='user__info-divs'>
              <label className='user__info-labels' htmlFor="lastname">Last Name</label>
              {isUser ?
                <input
                    className='user__info-inputs'
                    name='lastname'
                    type='text'
                    placeholder='Last Name'
                    value={lastname}
                    onChange={(e)=>setLastname(e.target.value)}
                ></input>
                :
                <div className='user__info-text' name='lastname'>{profileUser.lastname}</div>
              }
            </div>
          </div>
          <div className='user__info-divs'>
            {isUser ?
            <>
              <label className='user__info-labels' htmlFor="username">Username</label>
              <input
                  className='user__info-inputs'
                  type='text'
                  placeholder='First Name'
                  value={firstname}
                  onChange={(e)=>setFirstname(e.target.value)}
              ></input>
            </>
              :
            <>
              <label className='user__info-labels' htmlFor="firstname">First Name</label>
              <div className='user__info-text' name='firstname'>{profileUser.firstname}</div>
            </>
            }
          </div>
          <div className='user__info-divs'>
            {isUser ?
            <>
              <label className='user__info-labels' htmlFor="username">Username</label>
              <input
                  className='user__info-inputs'
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
              ></input>
            </> :
            <div className='user__info-text'>{profileUser.email}</div>
            }
          </div>
        </div>
      </div>
      <div className='user__stats'>
      </div>
    </form>
  );
}


/*************************** EXPORT ***************************/
export default User;
