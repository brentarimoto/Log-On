import {createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import session from "./session"
import friendsReducer from './friends'
import usersReducer from './users.js'
import messagesReducer from './messages.js'
import activeReducer from './activeMessages'
import activeOpenReducer from'./activeOpen'
import notificationsReducer from './notifications'
import gamesReducer from './games'
import roomsReducer from './rooms'
import friendUpdateReducer from './friendUpdate'
import foursReducer from './fours'
import gamesStatsReducer from './gameStats'

const rootReducer = combineReducers({
    session,
    friends: friendsReducer,
    users: usersReducer,
    messages: messagesReducer,
    active: activeReducer,
    open: activeOpenReducer,
    notifications: notificationsReducer,
    games: gamesReducer,
    rooms: roomsReducer,
    friendUpdate: friendUpdateReducer,
    fours:foursReducer,
    gameStats:gamesStatsReducer,
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
