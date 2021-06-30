/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_SOCKET = "socket/SET_SOCKET";

/*************************** ACTIONS ***************************/

export const setSocket = (socket) => ({
    type: SET_SOCKET,
    socket
});


/*************************** REDUCER ***************************/
const initialState = null;

export default function socketReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_SOCKET:
            return action.socket
        default:
            return state;
    }
}
