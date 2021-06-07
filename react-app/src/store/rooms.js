/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const JOIN_ROOM = "rooms/JOIN_ROOM";

const ADD_ROOM_MESSAGE = "rooms/ADD_ROOM_MESSAGE";

const RESET_ROOMS = "rooms/RESET_ROOMS";


/*************************** ACTIONS ***************************/
export const joinRoom = (hash) => ({
    type: JOIN_ROOM,
    hash,
});

export const addRoomMessage = (hash, message) => ({
    type: ADD_ROOM_MESSAGE,
    hash,
    message,
});

export const resetRooms = () => ({
    type: RESET_ROOMS,
});


/*************************** THUNKS ***************************/




/*************************** REDUCER ***************************/
const initialState = {};

export default function roomsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case JOIN_ROOM:
            newState = {...state}
            newState[action.hash]=[]
            return newState
        case ADD_ROOM_MESSAGE:
            newState = {...state}
            newState[action.hash]=[...newState[action.hash]]
            newState[action.hash].push(action.message)
            return newState
        case RESET_ROOMS:
            return initialState
        default:
            return state;
    }
}
