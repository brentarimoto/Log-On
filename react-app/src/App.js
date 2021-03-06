/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

/*************************** COMPONENT IMPORTS ***************************/
import NavBar from "./components/Navbar/NavBar";
import Splash from "./components/Splash/Splash";
import Home from "./components/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MessageBar from "./components/MessageBar/MessageBar";
import Games from "./components/Games/Games";
import FriendsPage from "./components/FriendsPage/FriendsPage";
import FriendsList from "./components/FriendsList.js/FriendsList";
import MessagesPage from "./components/MessagesPage/MessagesPage";
import AboutMe from "./components/AboutMe/AboutMe";

import { authenticate } from "./store/session";
import { addMessage, handleNewSocketMessage } from "./store/messages";
import { newNotification } from "./store/notifications";
import { setGameStats } from "./store/gameStats";
import { addOnline, removeOnline, setOnline } from "./store/online";
import { newFriendUpdate } from "./store/friendUpdate";
import { addFriend, handleUnFriended } from './store/friends'
import { useFirstLoad } from "./context/FirstLoad";

import background from "./images/background_image.jpg";
import { setSocket } from "./store/socket";
import { getUser } from "./store/users";


/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** COMPONENTS ***************************/
function App() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user)
  const {firstLoad, setFirstLoad} = useFirstLoad()

  useEffect(() => {
    (() => {
      dispatch(authenticate());
    })();
  }, [dispatch]);

  useEffect(()=>{
    if(user && firstLoad){
      dispatch(setGameStats(user.stats))

      if(!socket){
        socket=io()
        socket.user=user
        dispatch(setSocket(socket))
      } else{
        socket.user=user
        socket.emit('logon', {room:`User:${user.id}`})
      }


      socket.on('connect', ()=>{
        socket.emit('logon', {room:`User:${socket.user.id}`})
      })

      socket.on('disconnect', ()=>{
        setTimeout(() => {
          socket.connect();
          socket.emit('logon', {room:`User:${socket.user.id}`})
        }, 1000);
      })

      socket.on("online", ({friends}) => {
        if (friends[socket.user.id]){
          delete friends[socket.user.id]
        }
        dispatch(setOnline(friends))
      })

      socket.on("logon", ({sender_id}) => {
        if(sender_id!==socket.user.id){
          dispatch(addOnline(sender_id))
        }
      })

      socket.on("logoff", ({sender_id}) => {
        if(sender_id!==socket.user.id){
          dispatch(removeOnline(sender_id))
        }
      })

      socket.on("message", (message) => {
        dispatch(handleNewSocketMessage(message))
      })

      socket.on("friend_request", ({friend_request}) => {
        dispatch(newNotification(friend_request))
      })

      socket.on("accept_request", ({sender_id, friendship}) => {
        (async()=>{
          await dispatch(addFriend(sender_id, friendship))
          await dispatch(newFriendUpdate(sender_id))
          socket.emit('online')
        })()
      })

      socket.on("unfriend", ({sender_id}) => {
        (async()=>{
          await dispatch(handleUnFriended(sender_id))
          await dispatch(removeOnline(sender_id))
          await dispatch(getUser(sender_id))
          socket.emit('online')
        })()
      })

      socket.on("invitations", ({invitation}) => {
        if (invitation.sender.id !== socket.user.id){
          dispatch(newNotification(invitation))
        }
      })

      setFirstLoad(false)
    }
  },[user])

  useEffect(()=>{
    return ()=>{
      socket.disconnect()
    }
  },[])

  return (
    <div className='main' style={{backgroundImage: `url(${background})`}}>
      <BrowserRouter>
        <NavBar socket={socket}/>
        <div className='content'>
          <Switch>
            <Route path="/" exact={true}>
              {user ?
                <Home />:
                <Splash />
              }
            </Route>
            <ProtectedRoute path="/friends" exact={true} >
              <FriendsPage socket={socket}/>
            </ProtectedRoute>
            <ProtectedRoute path="/messages">
              <MessagesPage socket={socket}/>
            </ProtectedRoute>
            <ProtectedRoute path="/games/:game_id">
              <Games socket={socket}/>
            </ProtectedRoute>
            <Route path='/aboutme'>
              <AboutMe />
            </Route>
            <Route>
                <Redirect to='/'/>
            </Route>
          </Switch>
          <FriendsList socket={socket}/>
          <MessageBar socket={socket}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default App;
