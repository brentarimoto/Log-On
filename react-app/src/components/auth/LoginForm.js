import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { login } from "../../store/session";

const LoginForm = ({setShowModal}) => {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const user = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const onLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(credential, password));
    if (data.errors) {
      setErrors(data.errors);
    }
  };

  const demoLogin = async (e) => {
    e.preventDefault();
    const data = await dispatch(login('Demo', 'password'));
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

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <form onSubmit={onLogin} className='auth__form-container'>
      <div className='auth__form-header'>
        <div className='auth__form-header-image'>
          <img src='/images/Log-On.png'></img>
        </div>
      </div>
      <div className='auth__form-errors'>
        {errors.map((error) => (
          <div>{error}</div>
        ))}
      </div>
      <div className='auth__form-divs'>
        <label className='auth__form-labels' htmlFor="credential">Username/Email</label>
        <input
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
      <div className='auth__form-cancel' onClick={()=>setShowModal(false)}>
        <i className="fas fa-times"></i>
      </div>
    </form>
  );
};

export default LoginForm;
