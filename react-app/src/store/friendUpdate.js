/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const NEW_FRIEND_UPDATE = "update/NEW_FRIEND_UPDATE";

const UN_FRIEND_UPDATE = "update/UN_FRIEND_UPDATE";

const RESET_UPDATE = "update/RESET_UPDATE";


/*************************** ACTIONS ***************************/
export const newFriendUpdate = (userId) => ({
    type: NEW_FRIEND_UPDATE,
    userId,
});

export const unFriendUpdate = (userId) => ({
    type: UN_FRIEND_UPDATE,
    userId,
});

export const resetFriendUpdate = () => ({
    type: RESET_UPDATE,
});
/*************************** REDUCER ***************************/
const initialState = {};

export default function friendUpdateReducer(state=initialState, action) {
    switch (action.type) {
        case NEW_FRIEND_UPDATE:
            return {new:action.userId}
        case UN_FRIEND_UPDATE:
            return {un: action.userId}
        case RESET_UPDATE:
            return initialState
        default:
            return state;
    }
}
