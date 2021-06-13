/*************************** REACT IMPORTS ***************************/

import React from "react";
import { Link } from "react-router-dom";

/*************************** COMPONENT IMPORTS ***************************/
import LoginModal from "../auth/LoginModal";
import SignupModal from "../auth/SignupModal";
import logo from '../../images/Log-On.png'
import { useSearch } from "../../context/Search";

import './Splash.css'


/*************************** COMPONENTS ***************************/
function Splash() {

  const {modalOpen} = useSearch()

  return (
    <div className='splash'>
        {!modalOpen && <img className='splash__logo' alt='logo' src={logo}></img>}
        <div className='splash__login'>
            <LoginModal classname={modalOpen ? 'splash__modal-button--hidden' : 'splash__modal-button'}/>
        </div>
        <div className='splash__signup'>
            <SignupModal classname={modalOpen ? 'splash__modal-button--hidden' : 'splash__modal-button'}/>
        </div>
        <Link className='splash__aboutme' to='/aboutme'>
          <h3 className={modalOpen ? 'splash__modal-button--hidden' : 'splash__modal-button'}>About Me</h3>
        </Link>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default Splash;
