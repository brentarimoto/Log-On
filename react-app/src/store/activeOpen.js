/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_ACTIVE_OPEN = "open/SET_ACTIVE_OPEN";

const SET_SPECIFIC_ACTIVE_OPEN = "open/SET_SPECIFIC_ACTIVE_OPEN";

const SWITCH_ACTIVE_OPEN = "open/SWITCH_ACTIVE_OPEN";

const REMOVE_ACTIVE_OPEN = "open/REMOVE_ACTIVE_OPEN";

const RESET_ACTIVE_OPEN = "open/RESET_ACTIVE_OPEN";

/*************************** ACTIONS ***************************/

export const setActiveOpen = (user_id) => ({
    type: SET_ACTIVE_OPEN,
    user_id,
});

export const setSpecificActiveOpen = (user_id, boolean) => ({
    type: SET_SPECIFIC_ACTIVE_OPEN,
    user_id,
    boolean,
});

export const switchActiveOpen = (user_id) => ({
    type: SWITCH_ACTIVE_OPEN,
    user_id,
});

export const removeActiveOpen = (user_id) => ({
    type: REMOVE_ACTIVE_OPEN,
    user_id,
});

export const resetActiveOpen = () => ({
    type: RESET_ACTIVE_OPEN
});


/*************************** REDUCER ***************************/
const initialState = {friends: true};

export default function activeOpenReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_ACTIVE_OPEN:
            newState={...state}
            newState[action.user_id]=false
            return newState
        case SET_SPECIFIC_ACTIVE_OPEN:
            newState={...state}
            newState[action.user_id]=action.boolean
            return newState
        case SWITCH_ACTIVE_OPEN:
            newState={...state}
            newState[action.user_id]=!newState[action.user_id]
            return newState
        case REMOVE_ACTIVE_OPEN:
            newState={...state}
            delete newState[action.user_id]
            return newState
        case RESET_ACTIVE_OPEN:
          return initialState
        default:
            return state;
    }
}
