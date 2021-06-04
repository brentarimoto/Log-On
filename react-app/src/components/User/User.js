/*************************** REACT IMPORTS ***************************/
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';

/*************************** COMPONENT IMPORTS ***************************/
import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";
import Stat from './Stat'
import { unFriend } from "../../store/friends";


/*************************** CSS ***************************/
import './User.css'
import 'swiper/swiper-bundle.css';


/*************************** HELPER COMPONENT ***************************/
function FriendButtons({profileUser, unfriendOpen, setUnfriendOpen, friend_id}){

  const dispatch=useDispatch()

  const handleOpen=()=>{
    setUnfriendOpen(true)
  }

  const handleCancel=()=>{
    setUnfriendOpen(false)
  }

  const handleUnfriend=()=>{
    dispatch(unFriend(friend_id))
  }

  if (unfriendOpen){
    return(
      <>
        <p>Are you sure you want to unfriend <strong>{profileUser.username}</strong></p>
        <div className='user__info-buttons'>
          <button className='user__info-button' onClick={handleUnfriend}>Unfriend</button>
          <button className='user__info-button' onClick={handleCancel}>Cancel</button>
        </div>
      </>
    )
  } else{
    return(
      <div className='user__info-buttons'>
        <button className='user__info-button' onClick={handleOpen}><i className="fas fa-user-minus user_info-icon"></i> Unfriend</button>
        <button className='user__info-button'>Message</button>
      </div>
    )
  }
}


/*************************** COMPONENT ***************************/
function User({profileUser, friend_id}) {

  const user = useSelector(state=>state.session.user)
  const friends = useSelector(state=>state.friends)

  const [firstname, setFirstname] = useState(profileUser.firstname)
  const [lastname, setLastname] = useState(profileUser.lastname)
  const [username, setUsername] = useState(profileUser.username)
  const [email, setEmail] = useState(profileUser.email)
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState([])
  const [unfriendOpen, setUnfriendOpen] = useState(false);

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
            <label className='user__info-labels' htmlFor="username">Username</label>
            {isUser ?
              <input
                  className='user__info-inputs'
                  name='username'
                  type='text'
                  placeholder='Username'
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
              ></input>
              :
              <div className='user__info-text' name='username'>{profileUser.username}</div>
            }
          </div>
          <div className='user__info-divs'>
            <label className='user__info-labels' htmlFor="email">Email</label>
            {isUser ?
              <input
                  className='user__info-inputs'
                  name='email'
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
              ></input>
              :
              <div className='user__info-text' name='email'>{profileUser.email}</div>
            }
          </div>
        <div className='user__info-buttons-div'>
          {isUser && <button className='user__info-edit-button'>Save Changes</button>}
          {!friends[profileUser.id] ?
            <button className='user__info-button'><i className="fas fa-user-plus user_info-icon"></i>Send Friend Request</button>
            :
            <FriendButtons profileUser={profileUser} unfriendOpen={unfriendOpen} setUnfriendOpen={setUnfriendOpen} friend_id={friend_id}/>
          }
        </div>
        </div>
      </div>
      <div className='user__stats'>
        <Swiper
        style = {{width: '100%', height: '100%'}}
          spaceBetween={50}
          slidesPerView={1}
          onSlideChange={() => console.log('slide change')}
          onSwiper={(swiper) => console.log(swiper)}
        >
          {profileUser.stats.length>0 ?
            profileUser.stats.map((stat)=>(
              <SwiperSlide key={stat.id}><Stat stat={stat}/></SwiperSlide>
            ))
            :
            <SwiperSlide>
              <h1 className='user__stats-none'>
                {isUser ?
                  `You haven't played any games yet. Play a game to start ranking up now!`
                  :
                  `${profileUser.username} hasn't played any games yet. Start a game with them by clicking the play button above!`
                }
              </h1>
            </SwiperSlide>

          }
        </Swiper>
      </div>
    </form>
  );
}


/*************************** EXPORT ***************************/
export default User;
