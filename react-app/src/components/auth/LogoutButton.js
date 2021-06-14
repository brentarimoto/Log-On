import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { logout } from "../../store/session";

const LogoutButton = ({socket}) => {
  const dispatch = useDispatch();
  const history = useHistory()
  const user = useSelector(state=>state.session.user)

  const onLogout = async e => {
    e.preventDefault();
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
    socket.emit('logoff', {room:`User:${user.id}`})
    // socket.disconnect()
    await dispatch(logout())
    // socket=null
    history.push('/')
  }

  return <button className='user__info-button' onClick={onLogout}>Logout</button>;
};

export default LogoutButton;
