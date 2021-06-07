/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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


/*************************** COMPONENTS ***************************/
function App() {
  const dispatch = useDispatch();

  const [loaded, setLoaded] = useState(false);

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    (() => {
      dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

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
              <Games />
            </ProtectedRoute>
          </Switch>
          <FriendsList />
          <MessageBar />
        </div>
      </BrowserRouter>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default App;
