import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logout } from "../../store/session";

const LogoutButton = ({socket}) => {
  const dispatch = useDispatch();
  const history = useHistory()

  const user = useSelector(state=>state.session.user)
  const friends = useSelector(state=>state.friends)

  const onLogout = async e => {
    e.preventDefault();
    await dispatch(logout())
    history.push('/')
  }

  return <button className='user__info-button' onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
