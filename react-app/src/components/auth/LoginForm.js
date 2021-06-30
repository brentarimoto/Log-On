/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";



/*************************** COMPONENT IMPORTS ***************************/
import { login } from "../../store/session";
import { useSearch } from "../../context/Search";
import logo from '../../images/Log-On.png'
import { useFirstLoad } from "../../context/FirstLoad";



/*************************** COMPONENTS ***************************/
const LoginForm = ({setShowModal}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null)
  const history = useHistory()

  const {setModalOpen} = useSearch()
  const {setFirstLoad} = useFirstLoad()

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [cError, setCError] = useState(null);
  const [pError, setPError] = useState(null);

  useEffect(()=>{
    inputRef.current.focus()
  },[])

  useEffect(()=>{
    if(cError){
      setCError(null)
    }
    if(pError){
      setPError(null)
    }
  },[credential, password])

  const onLogin = async (e) => {
    e.preventDefault();

    setFirstLoad(true)
    const data = await dispatch(login(credential, password));

    if (data.errors) {
      data.errors.forEach((error)=>{
        const array = error.split(':')
        if (array[0].includes('credential')){
          setCError(error.split(':')[1])
        } else if (array[0].includes('password')){
          setPError(error.split(':')[1])
        }
      });
      setFirstLoad(false)
      return
    }

    setModalOpen(false)
    history.push('/')
  };


  const demoLogin = async (e) => {
    e.preventDefault();

    setFirstLoad(true)
    const data = await dispatch(login('Demo', 'password'));

    if (data.errors) {
      data.errors.forEach((error)=>{
        const array = error.split(':')
        if (array[0].includes('credential')){
          setCError(error.split(':')[1])
        } else if (array[0].includes('password')){
          setPError(error.split(':')[1])
        }
      });
      setFirstLoad(false)
      return
    }

    setModalOpen(false)
    history.push('/')
  };


  const demoLogin2 = async (e) => {
    e.preventDefault();

    setFirstLoad(true)
    const data = await dispatch(login('pokewong_go', 'password'));

    if (data.errors) {
      data.errors.forEach((error)=>{
        const array = error.split(':')
        if (array[0].includes('credential')){
          setCError(error.split(':')[1])
        } else if (array[0].includes('password')){
          setPError(error.split(':')[1])
        }
      });
      setFirstLoad(false)
      return
    }

    setModalOpen(false)
    history.push('/')
  };

  const updateCredential = (e) => {
    setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleCancel = ()=>{
    setShowModal(false)
    setModalOpen(false)
  }

  return (
    <form onSubmit={onLogin} className='auth__form-container auth__login'>
      <div className='auth__form-header'>
        <div className='auth__form-header-image'>
          <img alt='logo' src={logo}></img>
        </div>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="credential">Username/Email</label>
        <div className="auth__form-input-div">
          <input
            ref={inputRef}
            name="credential"
            type="text"
            value={credential}
            onChange={updateCredential}
            placeholder="Username/Email"
            className="auth__form-input"
            required
            />
            {cError &&
            <div className='auth__form-errors-login auth__form-errors-login--credential'>
              <div className="auth__form-errors-arrow"></div>
              <div className='auth__form-errors-text'>{cError}</div>
            </div>}
        </div>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="password">Password</label>
        <div className="auth__form-input-div">
          <input
            name="password"
            type="password"
            value={password}
            onChange={updatePassword}
            placeholder="Password"
            className="auth__form-input"
            required
          />
          {pError &&
          <div className='auth__form-errors-login auth__form-errors-login--password'>
            <div className="auth__form-errors-arrow"></div>
            <div className='auth__form-errors-text'>{pError}</div>
          </div>}
        </div>
      </div>
      <button type="submit" className='auth__form-button'>Login</button>
      <button type="submit" className='auth__form-button' onClick={demoLogin}>Demo</button>
      <button type="submit" className='auth__form-button' onClick={demoLogin2}>Demo 2</button>
      <div className='auth__form-cancel' onClick={handleCancel}>
        <i className="fas fa-times"></i>
      </div>
    </form>
  );
};

export default LoginForm;
