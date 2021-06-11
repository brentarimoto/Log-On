import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";

const ProtectedRoute = props => {
  const location = useLocation()

  const user = useSelector(state => state.session.user)

  if((location.pathname.includes('games')||location.pathname.includes('friends')||location.pathname.includes('messages')) && !user){
    localStorage.setItem('authorizing', location.pathname)
  }

  return (
    <Route {...props}>
      {(user) ? props.children  : <Redirect to="/" />}
    </Route>
  )
};


export default ProtectedRoute;
