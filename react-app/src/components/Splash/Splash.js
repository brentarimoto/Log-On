/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useSelector } from "react-redux";

/*************************** COMPONENT IMPORTS ***************************/
import LoginModal from "../auth/LoginModal";
import SignupModal from "../auth/SignupModal";
import logo from '../../images/Log-On.png'
import { useSearch } from "../../context/Search";

import './Splash.css'


/*************************** COMPONENTS ***************************/
function Splash() {
  const user = useSelector(state => state.session.user)

  const {modalOpen} = useSearch()

  return (
    <div className='splash'>
        <img className={modalOpen ? 'splash__logo--hidden' : 'splash__logo'} alt='logo' src={logo}></img>
        <div className='splash__login'>
            <LoginModal classname={modalOpen ? 'splash__modal-button--hidden' : 'splash__modal-button'}/>
        </div>
        <div className='splash__signup'>
            <SignupModal classname={modalOpen ? 'splash__modal-button--hidden' : 'splash__modal-button'}/>
        </div>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default Splash;
