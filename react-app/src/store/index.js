import {createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session"
import friendsReducer from './friends'
import usersReducer from './users.js'
import messagesReducer from './messages.js'
import activeReducer from './activeMessages'
import notificationsReducer from './notifications'
import activeOpenReducer from'./activeOpen'

const rootReducer = combineReducers({
    session,
    friends: friendsReducer,
    users: usersReducer,
    messages: messagesReducer,
    active: activeReducer,
    notifications: notificationsReducer,
    open: activeOpenReducer,
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
