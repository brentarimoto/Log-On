/*************************** REACT IMPORTS ***************************/

import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

/*************************** COMPONENT IMPORTS ***************************/
import NavBar from "./components/Navbar/NavBar";
import Splash from "./components/Splash/Splash";
import Home from "./components/Home/Home";
import ProtectedRoute from "./components/auth/ProtectedRoute";

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

  const handleMainClick=(e)=>{
    // if(!e.target.className.includes('message') && !e.target.className.includes('friend')){
    //   setCloseMessage(prev=>!prev)
    // }
  }


  return (
    <div className='main' style={{backgroundImage: `url(${background})`}} onClick={handleMainClick}>
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
            <ProtectedRoute path="messages" exact={true} >
              Messages
            </ProtectedRoute>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

/*************************** EXPORT ***************************/
export default App;
