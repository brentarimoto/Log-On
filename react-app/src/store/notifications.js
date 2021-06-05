/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const NEW_MESSAGE_NOTIFICATION = "notifications/NEW_MESSAGE_NOTIFICATION";

const READ_MESSAGE_NOTIFICATION = "notifications/READ_MESSAGE_NOTIFICATION";

/*************************** ACTIONS ***************************/

export const newMessageNotification = (user_id) => ({
    type: NEW_MESSAGE_NOTIFICATION,
    user_id,
});

export const readMessageNotification = (user_id) => ({
    type: READ_MESSAGE_NOTIFICATION,
    user_id,
});
/*************************** REDUCER ***************************/
const initialState = {messages:{}};

export default function notificationsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case NEW_MESSAGE_NOTIFICATION:
            newState={...state}
            if(newState.messages[action.user_id]){
                newState.messages[action.user_id]+=1
            } else{
                newState.messages[action.user_id]=1
            }
            return newState;
        case READ_MESSAGE_NOTIFICATION:
            newState={...state}
            newState.messages[action.user_id]=0
            return newState;
        default:
            return state;
    }
}
