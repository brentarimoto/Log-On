/*************************** OTHER FILE IMPORTS ***************************/

import { popActive } from "./activeMessages";
import { unFriendUpdate } from "./friendUpdate";
import { removeMessage } from "./messages";
import { removeMessageNotification } from "./notifications";
import { removeOnline } from "./online";


/*************************** TYPES ***************************/
const SET_FRIENDS = "friends/SET_FRIENDS";

const ADD_FRIEND = "friends/ADD_FRIEND";

const UPDATE_FRIEND_STATS = "friends/UPDATE_FRIEND_STATS";

const REMOVE_FRIEND = "friends/REMOVE_FRIEND";

const RESET_FRIENDS = "friends/RESET_FRIENDS";

/*************************** ACTIONS ***************************/
const setFriends = (friendships) => ({
    type: SET_FRIENDS,
    friendships,
});

export const addFriend = (user_id, friendship) => ({
    type: ADD_FRIEND,
    user_id,
    friendship
});

export const updateFriendStats = (user_id, game_id, stats) => ({
    type: UPDATE_FRIEND_STATS,
    user_id,
    game_id,
    stats
});

const removeFriend = (friend_id) => ({
    type: REMOVE_FRIEND,
    friend_id,
});

export const resetFriends = () => ({
    type: RESET_FRIENDS,
});



/*************************** THUNKS ***************************/
export const getFriends = (userId) => async (dispatch) => {
    const response = await fetch(`/api/friends/${userId}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    const friendsObj ={};

    data.friends.forEach((friendship)=>{
      const friend = friendship.requester ? friendship.requester : friendship.accepter
      if (friend?.id){
        friendsObj[friend.id] = friendship
      }
    })

    dispatch(setFriends(friendsObj))
    return friendsObj
}

export const friendAdded = (friend_id) => async (dispatch) => {
    const response = await fetch(`/api/friends/add/${friend_id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    const friendsObj ={};

    data.friends.forEach((friendship)=>{
      const friend = friendship.requester ? friendship.requester : friendship.accepter
      friendsObj[friend.id] = friendship
    })

    dispatch(setFriends(friendsObj))
    return friendsObj
}


export const acceptRequest = (userId) => async (dispatch) => {
    const response = await fetch(`/api/friends/${userId}`,{
      method:'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({version:'accepted'})
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(addFriend(userId, data.friend))
}

export const unFriend = (id) => async (dispatch) => {
    const response = await fetch(`/api/friends/${id}`,{
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(removeFriend(data.user.id))
}


/*************************** THUNKS ***************************/
export const handleUnFriended = (sender_id) => async (dispatch, getState) => {
  const state = getState()
  const active = state.active
  const notifications = state.notifications
  const messages = state.messages

  if(active.find(el=>el.user_id===sender_id)){
    dispatch(popActive(sender_id))
  }
  if(notifications[sender_id]){
    dispatch(removeMessageNotification(sender_id))
  }
  if(messages[sender_id]){
    dispatch(removeMessage(sender_id))
  }
  dispatch(unFriendUpdate(sender_id))
  dispatch(removeOnline(sender_id))
  dispatch(removeFriend(sender_id))
}




/*************************** REDUCER ***************************/
const initialState = {};

export default function friendsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_FRIENDS:
          return {...action.friendships}
        case ADD_FRIEND:
          newState={...state}
          newState[action.user_id] = action.friendship
          return newState
        case UPDATE_FRIEND_STATS:
          newState={...state}
          newState[action.user_id] = {...newState[action.user_id]}
          if(newState[action.user_id].accepter){
            newState[action.user_id].accepter={...newState[action.user_id].accepter}
            newState[action.user_id].accepter.stats={...newState[action.user_id].accepter.stats}
            newState[action.user_id].accepter.stats[action.game_id]=action.stats
          } else{
            newState[action.user_id].requester={...newState[action.user_id].requester}
            newState[action.user_id].requester.stats={...newState[action.user_id].requester.stats}
            newState[action.user_id].requester.stats[action.game_id]=action.stats
          }
          return newState
        case REMOVE_FRIEND:
          newState = {...state}
          delete newState[action.friend_id]
          return newState
        case RESET_FRIENDS:
          return initialState
        default:
            return state;
    }
}
