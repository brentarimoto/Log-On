/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_GAME_STATS = "stats/SET_GAME_STATS";

const UPDATE_GAME_STATS = "stats/UPDATE_GAME_STATS";

const RESET_GAME_STATS = "stats/RESET_GAME_STATS";


/*************************** ACTIONS ***************************/
export const setGameStats = (stats) => ({
    type: SET_GAME_STATS,
    stats
});

export const updateGameStats = (game_id, stats) => ({
    type: UPDATE_GAME_STATS,
    game_id,
    stats
});

export const resetGameStats = (game_id, stats) => ({
    type: RESET_GAME_STATS,
});


/*************************** REDUCER ***************************/
const initialState = {};

export default function gamesStatsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_GAME_STATS:
          return action.stats
        case UPDATE_GAME_STATS:
            newState={...state}
            newState[action.game_id]=action.stats
          return newState
        case RESET_GAME_STATS:
          return initialState
        default:
            return state;
    }
}
