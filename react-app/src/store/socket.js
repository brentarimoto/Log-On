/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_SOCKET = "socket/SET_SOCKET";

/*************************** ACTIONS ***************************/

export const setSocket = (socket) => ({
    type: SET_SOCKET
});

export const resetMessagePage = () => ({
    type: RESET_MESSAGE_PAGE
});


/*************************** REDUCER ***************************/
const initialState = null;

export default function socketReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_SOCKET:
            newState=action.user_id
            return newState
        default:
            return state;
    }
}
