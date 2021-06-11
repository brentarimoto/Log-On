/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const FOURS_START = "fours/GAME_START";

const FOURS_MOVE = "fours/FOURS_MOVE";

const RESET_FOURS = "fours/RESET_FOURS";


/*************************** ACTIONS ***************************/
export const gameStart = () => ({
    type: FOURS_START
});

export const foursMove = (column, row, player) => ({
    type: FOURS_MOVE,
    column,
    row,
    player
});

export const resetFours = () => ({
    type: RESET_FOURS
});

/*************************** THUNKS ***************************/


/*************************** REDUCER ***************************/
let board={};
for(let i =0;i<7;i++){
    let column={}
    for(let j=0; j<6;j++){
        column[j]=null
    }
    board[i]=column
}

const initialState = {board:board};

export default function foursReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case FOURS_START:
            newState = {...state}
            newState.gameStart=true
            return newState
        case FOURS_MOVE:
            newState = {...state}
            newState.board = {...newState.board}
            newState.board[action.column]={...newState.board[action.column]}
            newState.board[action.column][action.row]=action.player
            return newState
        case RESET_FOURS:
            return initialState
        default:
            return state;
    }
}
