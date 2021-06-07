/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const APPEND_ACTIVE = "active/APPEND_ACTIVE";

const POP_ACTIVE = "active/POP_ACTIVE";

const UPDATE_ACTIVE = "active/UPDATE_ACTIVE";

const RESET_ACTIVE = "active/RESET_ACTIVE";

/*************************** ACTIONS ***************************/
export const appendActive = (messages) => ({
    type: APPEND_ACTIVE,
    messages
});

export const popActive = (user_id) => ({
    type: POP_ACTIVE,
    user_id
});

export const updateActive = (user_id, message) => ({
    type: UPDATE_ACTIVE,
    user_id,
    message
});

export const resetActive = () => ({
    type: RESET_ACTIVE
});

/*************************** REDUCER ***************************/
const initialState = [];

export default function activeReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case APPEND_ACTIVE:
          newState=[...state]
          if (newState.length===3){
              newState.pop()
          }
          newState.unshift(action.messages)
          return newState
        case POP_ACTIVE:
            newState=state.filter((message)=>{
                return message.user_id!==action.user_id
            })
            return newState
        case UPDATE_ACTIVE:
            newState=[...state]
            newState=newState.map(value=>{
                value={...value}
                value.messages={...value.messages}
                if(value.user_id===action.user_id){
                    value.messages[action.message.id]=action.message
                }
                return value
            })
            return newState
        case RESET_ACTIVE:
          return initialState
        default:
            return state;
    }
}
