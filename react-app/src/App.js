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
import { setGameStats } from "./store/gameStats";
/*************************** SOCKET VARIABLE ***************************/
let socket;


/*************************** COMPONENTS ***************************/
function App() {
  const dispatch = useDispatch();

  const user = useSelector(state => state.session.user)
  const friends = useSelector(state=>state.friends)
  const friendUpdate = useSelector(state=>state.friendUpdate)
  const games = useSelector(state=>state.games)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    (() => {
      dispatch(authenticate());
    })();
  }, [dispatch]);

  useEffect(()=>{
    if(user && !loaded){
      dispatch(setGameStats(user.stats))

      socket=io()


      socket.on('connect', () => {
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

      return ()=>{
        socket.disconnect()
      }
    }

  },[user])

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
