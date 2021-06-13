/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_GAMES = "games/SET_GAMES";


const RESET_GAMES = "games/RESET_GAMES";


/*************************** ACTIONS ***************************/
const setGames = (games) => ({
    type: SET_GAMES,
    games
});

export const resetGames = (games) => ({
    type: RESET_GAMES,
});


/*************************** THUNKS ***************************/
export const getGames = () => async (dispatch) => {
    const response = await fetch(`/api/games/`);

    const data = await response.json();

    if (data.errors) {
        return;
    }

    dispatch(setGames(data.games))
}




/*************************** REDUCER ***************************/
const initialState = {};

export default function gamesReducer(state=initialState, action) {
    switch (action.type) {
        case SET_GAMES:
          return action.games
        case RESET_GAMES:
          return initialState
        default:
            return state;
    }
}
