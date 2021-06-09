/*************************** REACT IMPORTS ***************************/
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StaticRouter, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from 'swiper/react';

/*************************** COMPONENT IMPORTS ***************************/
import ProfilePhoto from "../ProfilePhoto/ProfilePhoto";
import Stat from './Stat'
import { acceptRequest, unFriend } from "../../store/friends";
import { cancelRequest, declineRequest, sendFriendRequest, } from "../../store/users";
import { popActive } from "../../store/activeMessages";
import { removeMessageNotification } from "../../store/notifications";
import { removeMessage } from "../../store/messages";
import { newFriendUpdate, unFriendUpdate } from "../../store/friendUpdate";


/*************************** CSS ***************************/
import './User.css'
import 'swiper/swiper-bundle.css';
import LogoutButton from "../auth/LogoutButton";


/*************************** HELPER COMPONENTS ***************************/
// ALREADY FRIENDS
function FriendButtons({profileUser, unfriendOpen, setUnfriendOpen, friend_id}){

  const dispatch=useDispatch()
  const friends = useSelector(state=>state.friends)
  const active = useSelector(state=>state.active)
  const notifications = useSelector(state=>state.notifications)
  const messages = useSelector(state=>state.messages)

  const handleOpen=()=>{
    setUnfriendOpen(true)
  }

  const handleCancel=()=>{
    setUnfriendOpen(false)
  }

  const handleUnfriend=()=>{
    if(active.find(el=>el.user_id===profileUser.id)){
      dispatch(popActive(profileUser.id))
    }
    if(notifications[profileUser.id]){
      dispatch(removeMessageNotification(profileUser.id))
    }
    if(messages[profileUser.id]){
      dispatch(removeMessage(profileUser.id))
    }
    dispatch(unFriend(friends[profileUser.id].id))
    dispatch(unFriendUpdate(profileUser.id))
    setUnfriendOpen(false)
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
        <button className='user__info-button' onClick={handleOpen}>
          <i className="fas fa-user-minus user_info-icon"></i>
          Unfriend
        </button>
        <button className='user__info-button'>Message</button>
      </div>
    )
  }
}


// NOT FRIENDS YET
function NotFriendButtons({profileUser, user}){

  const dispatch=useDispatch()

  const handleAccept=()=>{
    dispatch(acceptRequest(profileUser.id))
    dispatch(newFriendUpdate(profileUser.id))
  }

  const handleDecline=()=>{
    dispatch(declineRequest(profileUser.id))
  }

  const handleCancelRequest=()=>{
    dispatch(cancelRequest(profileUser.friends_accepted[user.id].id))
  }

  const handleSendRequest=()=>{
    dispatch(sendFriendRequest(profileUser.id))
  }


  if (profileUser.friends_requested[user.id]){
    return(
      <>
        <button className='user__info-button' onClick={handleAccept}>
          <i className="fas fa-user-plus user_info-icon"></i>
          Accept Request
        </button>
        {!profileUser.friends_requested[user.id].declined &&
          <button className='user__info-button' onClick={handleDecline}>
            <i className="fas fa-user-times user_info-icon"></i>
            Decline
          </button>}
      </>
    )
  } else if (profileUser.friends_accepted[user.id]){
    return(
      <>
        <button id='sentRequest' className='user__info-button--disabled'>
          <i className="fas fa-user-check user_info-icon" disabled></i>
          Friend Request Sent
        </button>
        <button className='user__info-button'  onClick={handleCancelRequest}>
          <i className="fas fa-user-times user_info-icon"></i>
          Cancel Request
        </button>
      </>
    )
  }else {
    return(
      <button className='user__info-button' onClick={handleSendRequest}>
        <i className="fas fa-user-plus user_info-icon"></i>
        Send Friend Request
      </button>
    )
  }
}


/*************************** COMPONENT ***************************/
function User({profileUserId, friend_id}) {

  const user = useSelector(state=>state.session.user)
  const friends = useSelector(state=>state.friends)
  const users= useSelector(state=>state.users)

  const isUser = user.id==profileUserId

  let profileUser;

  if(isUser) {
    profileUser=user
  } else if(friends[profileUserId]) {
    profileUser = friends[profileUserId].accepter ? friends[profileUserId].accepter : friends[profileUserId].requester
  } else{
    profileUser=users[profileUserId]
  }

  const [firstname, setFirstname] = useState(profileUser.firstname)
  const [lastname, setLastname] = useState(profileUser.lastname)
  const [username, setUsername] = useState(profileUser.username)
  const [email, setEmail] = useState(profileUser.email)
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState([])
  const [unfriendOpen, setUnfriendOpen] = useState(false);


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
          {(friends[profileUser.id] || isUser) && <div className='user__info-name'>
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
          </div>}
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
          {isUser ?
          <>
            <button className='user__info-button' onClick={handleSubmit}>Save Changes</button>
            <LogoutButton />
          </>
          :
          <>
            {!isUser &&
            <>
              {!friends[profileUser.id] ?
                <NotFriendButtons  profileUser={profileUser} user={user}/>
                :
                <FriendButtons profileUser={profileUser} unfriendOpen={unfriendOpen} setUnfriendOpen={setUnfriendOpen} friend_id={friend_id}/>
              }
            </>
            }
          </>
}
        </div>
        </div>
      </div>
      <div className='user__stats'>
        <Swiper
        style = {{width: '100%', height: '100%'}}
          spaceBetween={50}
          slidesPerView={1}
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
