/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_ONLINE = "online/SET_ONLINE";

const ADD_ONLINE = "online/ADD_ONLINE";

const REMOVE_ONLINE = "online/REMOVE_ONLINE";

const RESET_ONLINE = "online/RESET_ONLINE";


/*************************** ACTIONS ***************************/
export const setOnline= (online_friends) => ({
    type: SET_ONLINE,
    online_friends,
});

export const addOnline= (friend_id) => ({
    type: ADD_ONLINE,
    friend_id,
});

export const removeOnline= (friend_id) => ({
    type: REMOVE_ONLINE,
    friend_id,
});


export const resetOnline = () => ({
    type: RESET_ONLINE
});

/*************************** THUNKS ***************************/


/*************************** REDUCER ***************************/

const initialState = {};

export default function errorReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_ONLINE:
            return action.online_friends
        case ADD_ONLINE:
            newState={...state}
            newState[action.friend_id]=true
            return newState
        case REMOVE_ONLINE:
            newState={...state}
            if (newState[action.friend_id]){
                delete newState[action.friend_id]
            }
            return newState
        case RESET_ONLINE:
            return initialState
        default:
            return state;
    }
}
