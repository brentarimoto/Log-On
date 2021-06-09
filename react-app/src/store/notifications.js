/*************************** OTHER FILE IMPORTS ***************************/


/*************************** TYPES ***************************/
const SET_NOTIFICATIONS = "notifications/SET_NOTIFICATIONS";

const NEW_NOTIFICATION = "notifications/NEW_NOTIFICATION";

const DELETE_GAME_INVITATION = "notifications/DELETE_GAME_INVITATION";

const SET_MESSAGE_NOTIFICATION = "notifications/SET_MESSAGE_NOTIFICATION";

const NEW_MESSAGE_NOTIFICATION = "notifications/NEW_MESSAGE_NOTIFICATION";

const READ_MESSAGE_NOTIFICATION = "notifications/READ_MESSAGE_NOTIFICATION";

const REMOVE_MESSAGE_NOTIFICATION = "notifications/REMOVE_MESSAGE_NOTIFICATION";

const RESET_NOTIFICATIONS = "notifications/RESET_NOTIFICATIONS";

/*************************** ACTIONS ***************************/

export const setNotifications = (notifications) => ({
    type: SET_NOTIFICATIONS,
    notifications,
});

export const newNotification = (notification) => ({
    type: NEW_NOTIFICATION,
    notification,
});

export const deleteGameInvitation = (hash) => ({
    type: DELETE_GAME_INVITATION,
    hash,
});

export const setMessageNotifications = (messages) => ({
    type: SET_MESSAGE_NOTIFICATION,
    messages,
});

export const newMessageNotification = (user_id) => ({
    type: NEW_MESSAGE_NOTIFICATION,
    user_id,
});

export const readMessageNotification = (user_id) => ({
    type: READ_MESSAGE_NOTIFICATION,
    user_id,
});

export const removeMessageNotification = (user_id) => ({
    type: REMOVE_MESSAGE_NOTIFICATION,
    user_id,
});


export const resetNotifications = () => ({
    type: RESET_NOTIFICATIONS
});


/*************************** REDUCER ***************************/
const initialState = {messages:{}, notifications:[]};

export default function notificationsReducer(state=initialState, action) {
    let newState;
    switch (action.type) {
        case SET_NOTIFICATIONS:
            newState={...state}
            newState.notifications=action.notifications
            return newState;
        case NEW_NOTIFICATION:
            newState={...state}
            newState.notifications=[...newState.notifications]
            newState.notifications.unshift(action.notification)
            return newState;
        case DELETE_GAME_INVITATION:
            newState={...state}
            newState.notifications=[...newState.notifications]
            newState.notifications=newState.notifications.filter(notification=>{
                return notification.hash!==action.hash
            })
            return newState;
        case SET_MESSAGE_NOTIFICATION:
            newState={...state}
            newState.messages=action.messages
            return newState;
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
        case REMOVE_MESSAGE_NOTIFICATION:
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
