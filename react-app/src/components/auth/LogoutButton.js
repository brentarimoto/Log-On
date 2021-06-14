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
    // socket.disconnect()'
    socket.off('connect')
    socket.off('disconnect')
    socket.off('online')
    socket.off('logon')
    socket.off('logoff')
    socket.off('message')
    socket.off('friend_request')
    socket.off('accept_request')
    socket.off('unfriend')
    socket.off('invitations')
    socket.emit('logoff')
    setFirstLoad(false)
    await dispatch(logout())
    history.push('/')
  }

  return <button className='user__info-button' onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
