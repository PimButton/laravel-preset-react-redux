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

import authenticationReducer from './authentication';

/**
 * List all reducers
 */

const reducers = {
    router: {
        reducer: routerReducer,
        persist: false
    },
    authentication: {
        reducer: authenticationReducer,
        whitelist: ['token']
    }
};

/**
 * Combine all reducers
 */

let persistedReducers = {};
Object.keys(reducers).forEach(key => {

    // Retrieve the object properties
    let { reducer, ...props } = reducers[key];

    if(reducers[key].persist === false) {
        return persistedReducers[key] = reducer;
    }

    // Prepare config
    let config = {
        ...props,
        key: key,
        storage: localForage
    };

    // Create a new persisted reducer and store it
    persistedReducers[key] = persistReducer(config, reducer);

});

// Merge all persisted reducers
const appReducer = combineReducers(persistedReducers);

// Add logout reset layer
// const rootReducer = (state, action) => {
//     if(action.type === logout.getType()) {
//         state = undefined;
//     }

//     return appReducer(state, action);
// };
const rootReducer = appReducer;

export default rootReducer;