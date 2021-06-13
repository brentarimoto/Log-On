/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const JOIN_ROOM = "rooms/JOIN_ROOM";

const ADD_OPPONENT = "rooms/ADD_OPPONENT";

const UPDATE_OPPONENT = "rooms/UPDATE_OPPONENT";

const REMOVE_OPPONENT = "rooms/REMOVE_OPPONENT";

const ADD_ROOM_MESSAGE = "rooms/ADD_ROOM_MESSAGE";

const LEAVE_ROOM = "rooms/LEAVE_ROOM";

const RESET_ROOMS = "rooms/RESET_ROOMS";


/*************************** ACTIONS ***************************/
export const joinRoom = (hash,opponent) => ({
    type: JOIN_ROOM,
    hash,
    opponent
});

export const addOpponent = (hash,opponent) => ({
    type: ADD_OPPONENT,
    hash,
    opponent
});

export const updateOpponent = (hash, game_id,stats) => ({
    type: UPDATE_OPPONENT,
    hash,
    game_id,
    stats
});

export const removeOpponent = (hash) => ({
    type: REMOVE_OPPONENT,
    hash,
});

export const addRoomMessage = (hash, message) => ({
    type: ADD_ROOM_MESSAGE,
    hash,
    message,
});

export const leaveRoom = (hash) => ({
    type: LEAVE_ROOM,
    hash,
});


export const resetRooms = () => ({
    type: RESET_ROOMS,
});


/*************************** THUNKS ***************************/

export const setOpponent = (hash, userId) => async (dispatch, getState) => {
    const state=getState()
    const friend = state.friends[userId].accepter || state.friends[userId].requester
    dispatch(addOpponent(hash, friend))
}




/*************************** REDUCER ***************************/
const initialState = {};

export default function roomsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case JOIN_ROOM:
            newState = {}
            newState[action.hash]={opponent:null, messages:[]}
            if(action.opponent){
                newState[action.hash].opponent=action.opponent
            }
            return newState
        case ADD_OPPONENT:
            newState = {...state}
            newState[action.hash]={...newState[action.hash]}
            newState[action.hash].opponent = action.opponent
            return newState
        case UPDATE_OPPONENT:
            newState = {...state}
            newState[action.hash]={...newState[action.hash]}
            newState[action.hash].opponent = {...newState[action.hash].opponent}
            newState[action.hash].opponent.stats={...newState[action.hash].opponent.stats}
            newState[action.hash].opponent.stats[action.game_id]=action.stats
            return newState
        case REMOVE_OPPONENT:
            newState = {...state}
            newState[action.hash]={...newState[action.hash]}
            newState[action.hash].opponent = null
            return newState
        case ADD_ROOM_MESSAGE:
            newState = {...state}
            newState[action.hash]={...newState[action.hash]}
            newState[action.hash].messages=[...newState[action.hash].messages]
            newState[action.hash].messages.unshift(action.message)
            return newState
        case LEAVE_ROOM:
            newState = {...state}
            delete newState[action.hash]
            return newState
        case RESET_ROOMS:
            return initialState
        default:
            return state;
    }
}
