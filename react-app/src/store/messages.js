/*************************** OTHER FILE IMPORTS ***************************/
/*************************** TYPES ***************************/
const SET_MESSAGES = "messages/SET_MESSAGES";

const ADD_MESSAGE = "messages/ADD_MESSAGE";

const REMOVE_MESSAGE = "messages/REMOVE_MESSAGE";


/*************************** ACTIONS ***************************/
const setMessages = (user_id, messages) => ({
    type: SET_MESSAGES,
    user_id,
    messages
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
          newState[action.user_id][action.message.id]=action.message
          return newState
        case REMOVE_MESSAGE:
          newState={...state}
          delete newState[action.user_id]
          return newState
        default:
            return state;
    }
}
