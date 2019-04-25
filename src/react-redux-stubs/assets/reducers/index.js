/**
 * Import depedencies
 */

import { combineReducers } from 'redux';
import localForage from 'localforage';
import { persistReducer } from 'redux-persist';

/**
 * Import reducers
 */

import { routerReducer } from 'react-router-redux';
import { reducer as notificationsReducer } from 'reapop';

import authenticationReducer from './authentication';

/**
 * List all reducers
 */

const authenticationPersistConfig = {
    key: 'authentication',
    storage: localForage,
    whitelist: ['user', 'token']
};

const rootReducer = combineReducers({
    router: routerReducer,
    notifications: notificationsReducer(),
    authentication: persistReducer(authenticationPersistConfig, authenticationReducer),
});

export default rootReducer;