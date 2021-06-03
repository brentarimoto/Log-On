/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/*************************** COMPONENT IMPORTS ***************************/
import NavBar from "./components/Navbar/NavBar";
import Splash from "./components/Splash/Splash";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import UsersList from "./components/UsersList";
import User from "./components/User";
import { authenticate } from "./store/session";
import background from "./images/background_image.jpg";


/*************************** COMPONENTS ***************************/
function App() {
  const user = useSelector(state => state.session.user)
  const [loaded, setLoaded] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    (() => {
      dispatch(authenticate());
      setLoaded(true);
    })();
  }, [dispatch]);

  if (!loaded) {
    return null;
  }

  return (
    <div className='main' style={{backgroundImage: user ? 'none': `url(${background})`}}>
      <BrowserRouter>
        <NavBar />
        <div className='content'>
          <Switch>
            <Route path="/" exact={true}>
              {user ?
                <p>Home</p> :
                <Splash />
              }
            </Route>
            <ProtectedRoute path="/users" exact={true} >
              <UsersList/>
            </ProtectedRoute>
            <ProtectedRoute path="/users/:userId" exact={true} >
              <User />
            </ProtectedRoute>
            <ProtectedRoute path="/" exact={true} >
              <h1>My Home Page</h1>
            </ProtectedRoute>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default App;
