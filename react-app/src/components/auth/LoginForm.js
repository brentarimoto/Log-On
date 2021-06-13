/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect, useHistory } from "react-router-dom";



/*************************** COMPONENT IMPORTS ***************************/
import { login } from "../../store/session";
import { useSearch } from "../../context/Search";
import logo from '../../images/Log-On.png'



/*************************** COMPONENTS ***************************/
const LoginForm = ({setShowModal}) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null)
  const history = useHistory()
  const {setModalOpen} = useSearch()


  const user = useSelector(state => state.session.user);

  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(()=>{
    inputRef.current.focus()
  },[])

  const onLogin = async (e) => {
    e.preventDefault();

    const data = await dispatch(login(credential, password));

    setModalOpen(false)
    if (data.errors) {
      setErrors(data.errors);
    }
    history.push('/')
  };

  const demoLogin = async (e) => {
    e.preventDefault();

    const data = await dispatch(login('Demo', 'password'));

    setModalOpen(false)

    if (data.errors) {
      setErrors(data.errors);
    }
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
      {errors.length>0 &&
      <div className='auth__form-errors'>
        {errors.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>}
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="credential">Username/Email</label>
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
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={updatePassword}
          placeholder="Password"
          className="auth__form-input"
          required
        />
      </div>
      <button type="submit" className='auth__form-button'>Login</button>
      <button type="submit" className='auth__form-button' onClick={demoLogin}>Demo</button>
      <div className='auth__form-cancel' onClick={handleCancel}>
        <i className="fas fa-times"></i>
      </div>
    </form>
  );
};

export default LoginForm;
