/*************************** OTHER FILE IMPORTS ***************************/

import { updateActive } from "./activeMessages";
import { newMessageNotification } from "./notifications";

/*************************** TYPES ***************************/
const SET_GAMES = "games/SET_GAMES";


const RESET_GAMES = "games/RESET_GAMES";


/*************************** ACTIONS ***************************/
const setMessages = (games) => ({
    type: SET_GAMES,
    games
});

export const addMessage = (user_id, message) => ({
    type: ADD_MESSAGE,
    user_id,
    message
});

export const removeMessage = (user_id) => ({
    type: REMOVE_MESSAGE,
    user_id
});


export const resetMessages = () => ({
    type: RESET_MESSAGES
});



/*************************** THUNKS ***************************/
export const getMessages = (friendship_id, user_id) => async (dispatch) => {
    const response = await fetch(`/api/messages/${friendship_id}`);

    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(setMessages(user_id, data.messages))
    return {user_id:user_id, messages:data.messages}
}



/*************************** SPECIAL SOCKET THUNKS ***************************/
export const handleNewSocketMessage = (message,user) => async (dispatch, getState) => {
    const state = getState()
    const userId = message.sender_id!==user.id ? message.sender_id : message.receiver_id

    if(!state.messages[userId] && user.id!==message.sender_id){
        dispatch(newMessageNotification(userId))
    } else if(state.messages[userId] && (!state.active.find(el=>el.user_id===userId) || !state.open[userId]) && user.id!==message.sender_id){
        dispatch(addMessage(userId, message.message))
        dispatch(newMessageNotification(userId))
    // } else if(state.messages[userId] && state.active.find(el=>el.user_id===userId) && !state.open[userId]  && user.id!==message.sender_id){
    //     dispatch(addMessage(userId, message.message))
    //     dispatch(newMessageNotification(userId))
    } else{
        dispatch(addMessage(userId, message.message))
        dispatch(updateActive(userId, message.message))
    }
}



/*************************** REDUCER ***************************/
const initialState = {};

export default function messagesReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_MESSAGES:
          newState={...state}
          newState[action.user_id]=action.messages
          return newState
        case ADD_MESSAGE:
          newState={...state}
          newState[action.user_id]={...newState[action.user_id]}
          newState[action.user_id][action.message.id]=action.message
          return newState
        case REMOVE_MESSAGE:
          newState={...state}
          delete newState[action.user_id]
          return newState
        case RESET_MESSAGES:
          return initialState
        default:
            return state;
    }
}
