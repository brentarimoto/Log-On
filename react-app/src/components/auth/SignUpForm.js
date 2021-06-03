/*************************** REACT IMPORTS ***************************/
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import { Redirect } from 'react-router-dom';


/*************************** COMPONENT IMPORTS ***************************/
import { signUp } from '../../store/session';
import logo from '../../images/Log-On.png'


/*************************** COMPONENTS ***************************/
const SignUpForm = ({setShowModal}) => {

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [photo, setPhoto] = useState(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);


  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onSignUp = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
			await dispatch(signUp({username, email, firstname, lastname, photo, password}))
    } else {
      setErrors(['Passwords Do Not Match'])
    }
  };

  const updateUsername = (e) => {
    setUsername(e.target.value);
  };

  const updateEmail = (e) => {
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
    setPassword(e.target.value);
  };

  const updateConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  if (user) {
    return <Redirect to="/" />;
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
      <div className='auth__form-errors'>
        {errors.map((error) => (
          <div>{error}</div>
        ))}
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={updateUsername}
          value={username}
          className="auth__form-input"
          required
        ></input>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          placeholder="Email"
          onChange={updateEmail}
          value={email}
          className="auth__form-input"
          required
        ></input>
      </div>
      <div className='auth__form-name'>
        <div className='auth__form-divs auth__form-firstname'>
          <label className='auth__form-labels' htmlFor="username">First Name (optional)</label>
          <input
            type="text"
            name="firstname"
            placeholder="First Name"
            onChange={updateFirstname}
            value={firstname}
            className="auth__form-input"
          ></input>
        </div>
        <div className='auth__form-divs auth__form-lastname'>
          <label className='auth__form-labels' htmlFor="username">Last Name (optional)</label>
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
        <label className='auth__form-labels' htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={updatePassword}
          value={password}
          className="auth__form-input"
          required
        ></input>
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="confirm_password">Confirm Password</label>
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
      <button type="submit" className='auth__form-button'>Sign Up</button>
      <div className='auth__form-cancel' onClick={()=>setShowModal(false)}>
        <i className="fas fa-times"></i>
      </div>
    </form>
  );
};

export default SignUpForm;
