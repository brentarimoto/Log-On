/*************************** REACT IMPORTS ***************************/
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux"
import { useHistory } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import { signUp } from '../../store/session';
import { useSearch } from "../../context/Search";
import logo from '../../images/Log-On.png'
import { useFirstLoad } from "../../context/FirstLoad";


/*************************** COMPONENTS ***************************/
const SignUpForm = ({setShowModal}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const inputRef = useRef(null)
  const {setModalOpen} = useSearch()
  const {setFirstLoad} = useFirstLoad()

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState([]);
  const [uError, setUError] = useState(null);
  const [eError, setEError] = useState(null);
  const [pError, setPError] = useState(null);

  useEffect(()=>{
    inputRef.current.focus()
  },[])

  useEffect(()=>{
    if(errors.length>0){
      setErrors([])
    }
  },[username, email, firstname, lastname, photo, password, confirmPassword])

  const onSignUp = async (e) => {
    e.preventDefault();

    if(/\s/.test(username)){
      setUError(['Username cannot contain spaces'])
      return
    } else if (username.length>28){
      setUError(['Username must be less than 28 characters'])
      return
    } else if (username.length<1){
      setUError(['Please provide a username'])
      return
    }

    if(password.length<5){
      setPError(['Password must 5 characters or longer'])
      return
    }

    if(!/\d/.test(password)){
      setPError(['Password must contain number'])
      return
    }

    if(!/[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/.test(password)){
      setPError(['Password must contain a special character'])
      return
    }

    if(password !== confirmPassword){
      setPError(['Passwords must match'])
      return
    }

    if (!uError && !eError && !pError) {
			const data = await dispatch(signUp({username, email, firstname, lastname, photo, password}))

      if(data.errors){
        data.errors.forEach((error)=>{
          const array = error.split(':')
          if (array[0].includes('username')){
            setUError(error.split(':')[1])
          } else if (array[0].includes('password')){
            setPError(error.split(':')[1])
          } else{
            setEError(error.split(':')[1])
          }
        });
        return
      }


      setModalOpen(false)
      setFirstLoad(true)
      history.push('/')
    }


  };

  const updateUsername = (e) => {
    if (uError){
      setUError(null)
    }
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
    if (eError){
      setEError(null)
    }
    setEmail(e.target.value);
  };

  const updateFirstname = (e) => {
    setFirstname(e.target.value);
  };

  const updateLastname = (e) => {
    setLastname(e.target.value);
  };

  const updatePhoto = (e) => {
    setPhoto(e.target.files[0]);
  };


  const updatePassword = (e) => {
    if (pError){
      setPError(null)
    }
    setPassword(e.target.value);
  };

  const updateConfirmPassword = (e) => {
    if (pError){
      setPError(null)
    }
    setConfirmPassword(e.target.value);
  };

  const handleCancel = ()=>{
    setShowModal(false)
    setModalOpen(false)
  }

  return (
    <form onSubmit={onSignUp} className='auth__form-container'>
      <div className='auth__form-header'>
        <div className='auth__form-header-image'>
          <img alt='logo' src={logo}></img>
        </div>
        <h2 className='auth__form-header-text'>
          Signup and Play!
        </h2>
      </div>
      {errors.length>0 &&
      <div className='auth__form-errors'>
        {errors.map((error) => (
          <div key={error}>{error}</div>
        ))}
      </div>}
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="username">Username</label>
        <div className="auth__form-input-div">
          <input
            ref={inputRef}
            type="text"
            name="username"
            placeholder="Username"
            onChange={updateUsername}
            value={username}
            className="auth__form-input"
            required
          ></input>
          {uError &&
          <div className='auth__form-errors-login auth__form-errors-login--password'>
            <div className="auth__form-errors-arrow"></div>
            <div className='auth__form-errors-text'>{uError}</div>
          </div>}
        </div>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="email">Email</label>
        <div className="auth__form-input-div">
          <input
            type="text"
            name="email"
            placeholder="Email"
            onChange={updateEmail}
            value={email}
            className="auth__form-input"
            required
          ></input>
          {eError &&
          <div className='auth__form-errors-login auth__form-errors-login--password'>
            <div className="auth__form-errors-arrow"></div>
            <div className='auth__form-errors-text'>{eError}</div>
          </div>}
        </div>
      </div>
      <div className='auth__form-name'>
        <div className='auth__form-divs auth__form-firstname'>
          <label className='auth__form-labels' htmlFor="username">First Name (optional)</label>
          <div className="auth__form-input-div">
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              onChange={updateFirstname}
              value={firstname}
              className="auth__form-input"
            ></input>
          </div>
        </div>
        <div className='auth__form-divs auth__form-lastname'>
          <label className='auth__form-labels' htmlFor="username">Last Name (optional)</label>
          <div className="auth__form-input-div">
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              onChange={updateLastname}
              value={lastname}
              className="auth__form-input"
            ></input>
          </div>
        </div>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="profpic">Profile Picture (optional)</label>
        <div className='auth__form-profpic-div'>
          <div className="auth__form-profpic-text" name='profpic'>
            {photo ? `${photo.name}` : "No file chosen"}
          </div>
          <input
            type="file"
            id="profpic__input"
            onChange={updatePhoto}
            hidden
          />
          <label htmlFor="profpic__input" className="auth__form-profpic-button">
            <div id="profpic__btn-button">Choose File</div>
          </label>
        </div>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="password">Password (Must contain one number, one special character)</label>
        <div className="auth__form-input-div">
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={updatePassword}
            value={password}
            className="auth__form-input"
            required
          ></input>
          {pError &&
          <div className='auth__form-errors-login auth__form-errors-login--password'>
            <div className="auth__form-errors-arrow"></div>
            <div className='auth__form-errors-text'>{pError}</div>
          </div>}
        </div>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="confirm_password">Confirm Password (Must contain one number, one special character)</label>
        <div className="auth__form-input-div">
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            onChange={updateConfirmPassword}
            value={confirmPassword}
            className="auth__form-input"
            required
          ></input>
        </div>
      </div>
      <button type="submit" className='auth__form-button'>Sign Up</button>
      <div className='auth__form-cancel' onClick={handleCancel}>
        <i className="fas fa-times"></i>
      </div>
    </form>
  );
};

export default SignUpForm;
