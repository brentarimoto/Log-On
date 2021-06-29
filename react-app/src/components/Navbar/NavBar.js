/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import SearchBar from '../SearchBar/SearchBar';
import LoginModal from '../auth/LoginModal'
import SignupModal from '../auth/SignupModal'
import Notifications from './Notifications/Notifications';
import NotificationBubble from '../NotificationBubble/NotificationBubble';

import logo from '../../images/Log-On-Icon.png'

/*************************** CSS ***************************/
import './NavBar.css'
import UserModal from '../User/UserModal';

/*************************** COMPONENTS ***************************/
const NavBar = ({socket, setLoaded}) => {
  const location = useLocation()

  const user = useSelector(state=>state.session.user)
  const messageNotifications = useSelector(state=>state.notifications.messages)
  const normalNotifications = useSelector(state=>state.notifications.notifications)

  const [messageCount, setMessageCount] = useState(0)

  useEffect(()=>{
    setMessageCount(Object.values(messageNotifications).reduce((el,sum)=>sum+el, 0))
  },[messageNotifications])

  return (
    <nav className='navbar'>
      <div className='navbar__search-div'>
        {user && <SearchBar socket={socket}/>}
      </div>
      <div className='navbar__logo-div noselect'>
        {(user || location.pathname.includes('aboutme')) && <Link to="/" exact={true} className='navbar__logo-link'>
            <img className='navbar__logo'alt='logo' src={logo}></img>
        </Link>}
      </div>
      <div className='navbar__links-div'>
        {user ?
        <>
          <Link className='navbar__aboutme' to='/aboutme'>
            <div className='navbar__icon'>
              <i className="fas fa-at"></i>
            </div>
          </Link>
          <Link className='navbar__friends' to='/friends'>
            <div className='navbar__icon'>
              <i className="fas fa-users"></i>
            </div>
          </Link>
          <Link className='navbar__messages' to='/messages'>
            <div className='navbar__icon'>
              <i className="fas fa-comment-alt"></i>
            </div>
            <NotificationBubble notificationsNum={messageCount}/>
          </Link>
          <div className='navbar__notifications'>
            <Notifications socket={socket}/>
            <NotificationBubble notificationsNum={normalNotifications.length}/>
          </div>
          <div className='navbar__account'>
            <UserModal friend={user} socket={socket}/>
          </div>
        </> :
        <>
          <LoginModal classname='navbar__modal-button'/>
          <SignupModal classname='navbar__modal-button'/>
        </>}
      </div>
    </nav>
  );
}


/*************************** EXPORT ***************************/
export default NavBar;
