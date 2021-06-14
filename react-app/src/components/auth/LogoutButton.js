import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useFirstLoad } from "../../context/FirstLoad";
import { logout } from "../../store/session";

const LogoutButton = ({socket}) => {
  const dispatch = useDispatch();
  const history = useHistory()

  const {setFirstLoad} = useFirstLoad()

  const onLogout = async e => {
    e.preventDefault();
    socket.disconnect()
    setFirstLoad(false)
    await dispatch(logout())
    history.push('/')
  }

  return <button className='user__info-button' onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
