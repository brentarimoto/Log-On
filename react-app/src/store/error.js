/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_ERROR = "error/SET_ERROR";

const RESET_ERROR = "error/RESET_ERROR";


/*************************** ACTIONS ***************************/
export const setError = () => ({
    type: SET_ERROR
});

export const resetError = () => ({
    type: RESET_ERROR
});

/*************************** THUNKS ***************************/


/*************************** REDUCER ***************************/

const initialState = {error:false};

export default function errorReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_ERROR:
            return {error:true}
        case RESET_ERROR:
            return initialState
        default:
            return state;
    }
}
