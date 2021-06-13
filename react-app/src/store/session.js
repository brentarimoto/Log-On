/*************************** OTHER FILE IMPORTS ***************************/

import { resetFriends } from "./friends";
import { resetUsers } from "./users";
import { resetMessages } from "./messages";
import { resetActive } from "./activeMessages";
import { resetActiveOpen } from "./activeOpen";
import { resetNotifications } from "./notifications";
import { resetGames } from "./games";
import { resetRooms } from "./rooms";
import { resetFriendUpdate } from "./friendUpdate";
import { resetFours } from "./fours";
import { resetGameStats } from "./gameStats";
import { resetOnline } from "./online";
import { resetMessagePage } from "./messagepage";


/*************************** TYPES ***************************/
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const UPDATE_USER_STATS = "session/UPDATE_USER_STATS";

/*************************** ACTIONS ***************************/
const setUser = (user) => ({
    type: SET_USER,
    payload: user
});

const removeUser = () => ({
    type: REMOVE_USER,
})

export const updateUserStats = (game_id, stats) => ({
    type: UPDATE_USER_STATS,
    game_id,
    stats
})

/*************************** REDUCER ***************************/
export const authenticate = () => async (dispatch) => {
    const response = await fetch('/api/auth/',{
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(setUser(data))
  }

export const login = (credential, password) => async (dispatch)  => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      credential,
      password
    })
  });
  const data = await response.json();
  if (data.errors) {
      return data;
  }

  dispatch(setUser(data))
  return {};
}

export const logout = () => async (dispatch) => {
  const response = await fetch("/api/auth/logout", {
    headers: {
      "Content-Type": "application/json",
    }
  });

  const data = await response.json();

  if (data.errors) {
      return data;
  }

  dispatch(resetMessagePage())
  dispatch(resetOnline())
  dispatch(resetGameStats())
  dispatch(resetFours())
  dispatch(resetFriendUpdate())
  dispatch(resetRooms())
  dispatch(resetGames())
  dispatch(resetNotifications())
  dispatch(resetActiveOpen())
  dispatch(resetActive())
  dispatch(resetMessages())
  dispatch(resetUsers())
  dispatch(resetFriends())
  dispatch(removeUser());
};


export const signUp = ({username, email, firstname, lastname, photo, password}) => async (dispatch)  => {

  const formData = new FormData();
  formData.append('username', username)
  formData.append('email', email)
  formData.append('firstname', firstname)
  formData.append('lastname', lastname)
  formData.append("profile_photo", photo);
  formData.append('password', password)

  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  if (data.errors) {
      return data;
  }

  dispatch(setUser(data))
  return {};
}


export const editUser = ({id, username, email, firstname, lastname, photo}) => async (dispatch)  => {

  const formData = new FormData();
  formData.append('username', username)
  formData.append('email', email)
  formData.append('firstname', firstname)
  formData.append('lastname', lastname)
  formData.append("profile_photo", photo);


  const response = await fetch(`/api/auth/${id}`, {
    method: "PUT",
    body: formData,
  });

  const data = await response.json();
  if (data.errors) {
      return data;
  }

  dispatch(setUser(data))
  return {};
}

/*************************** REDUCER ***************************/
const initialState = { user: null };
export default function reducer(state=initialState, action) {
  let newState;
    switch (action.type) {
        case SET_USER:
            return {user: action.payload}
        case UPDATE_USER_STATS:
          newState={...state}
          newState.user={...newState.user}
          newState.user.stats={...newState.user.stats}
          newState.user.stats[action.game_id]=action.stats
          return newState
        case REMOVE_USER:
            return {user: null}
        default:
            return state;
    }
}
