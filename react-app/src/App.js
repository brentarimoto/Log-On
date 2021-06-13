/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch, useHistory } from "react-router-dom";
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
import { handleNewSocketMessage } from "./store/messages";
import { newNotification } from "./store/notifications";
import { setGameStats } from "./store/gameStats";
import { addOnline, removeOnline, setOnline } from "./store/online";
import { newFriendUpdate } from "./store/friendUpdate";
import { addFriend, handleUnFriended } from './store/friends'

import background from "./images/background_image.jpg";


/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** COMPONENTS ***************************/
function App() {
  const dispatch = useDispatch();
  const history = useHistory()

  const user = useSelector(state => state.session.user)
  const friends = useSelector(state=>state.friends)
  const rooms = useSelector(state=>state.rooms)
  const friendUpdate = useSelector(state=>state.friendUpdate)
  const games = useSelector(state=>state.games)
  const [loaded, setLoaded] = useState(false)
  const [room, setRoom] = useState('')

  // window.addEventListener('beforeunload', (e)=> {
  //   return socket.disconnect()
  // });

  // window.addEventListener('unload', (e)=> {
  //   return socket.disconnect()
  // });

  useEffect(() => {
    (() => {
      dispatch(authenticate());
    })();
  }, [dispatch]);

  useEffect(()=>{
    if(user && !loaded){
      dispatch(setGameStats(user.stats))

      socket=io()

      socket.on('connect', ()=>{
        socket.emit('logon', {room:`User:${user.id}`})
      })

      socket.on("online", ({friends}) => {
        console.log(friends)
        dispatch(setOnline(friends))
      })

      socket.on("logon", ({sender_id}) => {
        if(sender_id!=user.id){
          dispatch(addOnline(sender_id))
        }
      })

      socket.on("logoff", ({sender_id}) => {
        if(sender_id!=user.id){
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
        dispatch(addFriend(sender_id, friendship))
        dispatch(newFriendUpdate(sender_id))
      })

      socket.on("unfriend", ({sender_id}) => {
        dispatch(handleUnFriended(sender_id))
      })

      socket.on("invitations", ({invitation}) => {
        if (invitation.sender.id !== user.id){
          dispatch(newNotification(invitation))
        }
      })
      setLoaded(true)
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
              <FriendsPage />
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
