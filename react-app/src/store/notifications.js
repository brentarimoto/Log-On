/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const NEW_MESSAGE_NOTIFICATION = "notifications/NEW_MESSAGE_NOTIFICATION";

const READ_MESSAGE_NOTIFICATION = "notifications/READ_MESSAGE_NOTIFICATION";

const REMOVE_NOTIFICATION = "notifications/REMOVE_NOTIFICATION";

const RESET_NOTIFICATIONS = "notifications/RESET_NOTIFICATIONS";

/*************************** ACTIONS ***************************/

export const newMessageNotification = (user_id) => ({
    type: NEW_MESSAGE_NOTIFICATION,
    user_id,
});

export const readMessageNotification = (user_id) => ({
    type: READ_MESSAGE_NOTIFICATION,
    user_id,
});

export const removeNotification = (user_id) => ({
    type: REMOVE_NOTIFICATION,
    user_id,
});

export const resetNotifications = () => ({
    type: RESET_NOTIFICATIONS
});
/*************************** REDUCER ***************************/
const initialState = {messages:{}};

export default function notificationsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case NEW_MESSAGE_NOTIFICATION:
            newState={...state}
            newState.messages={...newState.messages}
            if(newState.messages[action.user_id]){
                newState.messages[action.user_id]+=1
            } else{
                newState.messages[action.user_id]=1
            }
            return newState;
        case READ_MESSAGE_NOTIFICATION:
            newState={...state}
            newState.messages={...newState.messages}
            newState.messages[action.user_id]=0
            return newState;
        case REMOVE_NOTIFICATION:
            newState={...state}
            newState.messages={...newState.messages}
            delete newState.messages[action.user_id]
            return newState;
        case RESET_NOTIFICATIONS:
          return initialState
        default:
            return state;
    }
}
