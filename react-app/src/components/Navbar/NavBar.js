/*************************** REACT IMPORTS ***************************/
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import SearchBar from '../SearchBar/SearchBar';
import LogoutButton from '../auth/LogoutButton';
import LoginModal from '../auth/LoginModal'
import SignupModal from '../auth/SignupModal'


/*************************** CSS ***************************/
import './NavBar.css'

/*************************** COMPONENTS ***************************/
const NavBar = () => {
  const user = useSelector(state=>state.session.user)

  return (
    <nav className='navbar'>
      <div className='navbar__search-div'>
        {user && <SearchBar />}
      </div>
      <div className='navbar__logo-div'>
        <NavLink to="/" exact={true} activeClassName="active" className='navbar__logo-link'>
            <img className='navbar__logo'alt='logo' src='/images/Log-On.png'></img>
        </NavLink>
      </div>
      <div className='navbar__links-div'>
        {user ?
        <>
          <LogoutButton />
        </> :
        <>
          <LoginModal />
          <SignupModal />
        </>}
      </div>
    </nav>
  );
}


/*************************** EXPORT ***************************/
export default NavBar;
