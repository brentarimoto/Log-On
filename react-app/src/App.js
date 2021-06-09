/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

/*************************** COMPONENT IMPORTS ***************************/
import NavBar from "./components/Navbar/NavBar";
import Splash from "./components/Splash/Splash";
import Home from "./components/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MessageBar from "./components/MessageBar/MessageBar";
import Games from "./components/Games/Games";

import { authenticate } from "./store/session";
import background from "./images/background_image.jpg";
import FriendsList from "./components/FriendsList.js/FriendsList";
import { handleNewSocketMessage } from "./store/messages";
import { newNotification } from "./store/notifications";

/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** HELPER FUNCTION ***************************/
function messageHash(userId, friendId){
  return `Message:${userId>friendId ? friendId : userId}-${userId>friendId ? userId : friendId}`
}


/*************************** COMPONENTS ***************************/
function App() {
  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);

  const user = useSelector(state => state.session.user)
  const friends = useSelector(state=>state.friends)
  const friendUpdate = useSelector(state=>state.friendUpdate)

  useEffect(() => {
    (() => {
      dispatch(authenticate());
    })();
  }, [dispatch]);

  useEffect(()=>{
    socket=io()
    console.log(socket)

    if(!loaded && Object.keys(friends).length){
      socket.on('connect', () => {
        if(Object.keys(friends).length>0){
          for (let id in friends) {
              socket.emit('join', {room:messageHash(friends[id].accept_id, friends[id].request_id)})
            }
          }
      })

      setLoaded(true)
    }

    if(friendUpdate.new){
      socket.emit('join', {room:messageHash(user.id, friendUpdate.new)})
    }

    if(friendUpdate.un){
      socket.emit('leave', {room:messageHash(user.id, friendUpdate.un)})
    }

    socket.on("message", (message) => {
      dispatch(handleNewSocketMessage(message, user))
    })

    socket.on("invitations", ({invitation}) => {
      if ((invitation.sender.id !== user.id)){
        dispatch(newNotification(invitation))
      }
    })

    return ()=>{
      socket.disconnect()
    }
  },[friends, friendUpdate])

  return (
    <div className='main' style={{backgroundImage: `url(${background})`}}>
      <BrowserRouter>
        <NavBar />
        <div className='content'>
          <Switch>
            <Route path="/" exact={true}>
              {user ?
                <Home />:
                <Splash />
              }
            </Route>
            <ProtectedRoute path="/friends" exact={true} >
              Friends
            </ProtectedRoute>
            <ProtectedRoute path="/messages" exact={true} >
              Messages
            </ProtectedRoute>
            <ProtectedRoute path="/games/:game_id" exact={true} >
              <Games socket={socket}/>
            </ProtectedRoute>
          </Switch>
          <FriendsList />
          <MessageBar socket={socket}/>
        </div>
      </BrowserRouter>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default App;
