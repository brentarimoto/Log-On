/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_MESSAGE_PAGE = "messagepage/SET_MESSAGE_PAGE";

const RESET_MESSAGE_PAGE = "messagepage/RESET_MESSAGE_PAGE";
/*************************** ACTIONS ***************************/

export const setMessagePage = (user_id) => ({
    type: SET_MESSAGE_PAGE,
    user_id,
});

export const resetMessagePage = () => ({
    type: RESET_MESSAGE_PAGE
});


/*************************** REDUCER ***************************/
const initialState = null;

export default function messagepageReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_MESSAGE_PAGE:
            newState=action.user_id
            return newState
        case RESET_MESSAGE_PAGE:
          return initialState
        default:
            return state;
    }
}
