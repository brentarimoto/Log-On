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

import { authenticate } from "./store/session";
import { handleNewSocketMessage } from "./store/messages";
import { newNotification } from "./store/notifications";
import { setGameStats } from "./store/gameStats";
import background from "./images/background_image.jpg";
import MessagesPage from "./components/MessagesPage/MessagesPage";
import { setError } from "./store/error";
/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** COMPONENTS ***************************/
function App() {
  const dispatch = useDispatch();
  const history = useHistory()

  const user = useSelector(state => state.session.user)
  const rooms = useSelector(state=>state.rooms)
  const friendUpdate = useSelector(state=>state.friendUpdate)
  const games = useSelector(state=>state.games)
  const [loaded, setLoaded] = useState(false)
  const [room, setRoom] = useState('')

  useEffect(() => {
    (() => {
      dispatch(authenticate());
    })();
  }, [dispatch]);

  useEffect(()=>{
    if(user && !loaded){
      dispatch(setGameStats(user.stats))

      socket=io()
      console.log(socket)

      socket.on('connect', ()=>{
        socket.emit('join', {room:`User:${user.id}`})
      })

      socket.on("message", (message) => {
        dispatch(handleNewSocketMessage(message))
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

  // useEffect(()=>{
  //   if(Object.keys(rooms)[0]){
  //     setRoom(Object.keys(rooms)[0])
  //     console.log('ROOM SET')
  //   }

  //   if(room && !rooms[room]){
  //     socket.emit('leave', {room:room})
  //     setRoom('')
  //   }

  // },[rooms])

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
              <FriendsPage />
            </ProtectedRoute>
            <ProtectedRoute path="/messages">
              <MessagesPage socket={socket}/>
            </ProtectedRoute>
            <ProtectedRoute path="/games/:game_id">
              <Games socket={socket}/>
            </ProtectedRoute>
            <Route>
                <Redirect to='/'/>
            </Route>
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
