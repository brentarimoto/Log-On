/*************************** REACT IMPORTS ***************************/
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';


/*************************** COMPONENT IMPORTS ***************************/
import SearchBar from '../SearchBar/SearchBar';
import LogoutButton from '../auth/LogoutButton';
import LoginModal from '../auth/LoginModal'
import SignupModal from '../auth/SignupModal'
import logo from '../../images/Log-On.png'


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
        {user && <NavLink to="/" exact={true} activeClassName="active" className='navbar__logo-link'>
            <img className='navbar__logo'alt='logo' src={logo}></img>
        </NavLink>}
      </div>
      <div className='navbar__links-div'>
        {user ?
        <>
          <LogoutButton />
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
