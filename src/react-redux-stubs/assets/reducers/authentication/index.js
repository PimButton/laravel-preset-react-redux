import { createReducer } from 'redux-act';

/**
 * Import actions
 */

import {
    request as retrieveRequest,
    success as retrieveSuccess,
    error as retrieveError
} from 'actions/authentication/retrieve';

import {
    request as loginRequest,
    success as loginSuccess,
    error as loginError
} from 'actions/authentication/login';

import { logout } from 'actions/authentication/logout';
import completeInitialisation from 'actions/authentication/initialise';

import {
    request as refreshTokenRequest,
    success as refreshTokenSuccess,
    error as refreshTokenError
} from 'actions/authentication/refresh';

/**
 * Create reducer
 */

// Specify default state
const defaultState = {
    isInitialising: true,
    isInitialised: false,
    isLoggedIn: false,
    isSubmitting: false,
    token: null,
    user: null
};

const authentication = createReducer({
    [retrieveRequest]: (state) => ({
        ...state,
        isInitialising: true
    }),
    [retrieveSuccess]: (state, payload) => ({
        ...state,
        user: payload,
        isLoggedIn: true,
        isInitialising: false,
        isInitialised: true
    }),
    [retrieveError]: (state) => ({
        ...state,
        isLoggedIn: false,
        isInitialising: false,
        isInitialised: true
    }),

    [loginRequest]: (state) => ({
        ...state,
        isSubmitting: true
    }),
    [loginSuccess]: (state, token) => ({
        ...state,
        isSubmitting: false,
        token
    }),
    [loginError]: (state) => ({
        ...state,
        isLoggedIn: false,
        isSubmitting: false
    }),
    
    [refreshTokenRequest]: (state) => ({
        ...state,
        isSubmitting: true
    }),
    [refreshTokenSuccess]: (state, token) => ({
        ...state,
        isLoggedIn: true,
        isSubmitting: false,
        token
    }),
    [refreshTokenError]: (state) => ({
        ...state,
        isLoggedIn: false,
        isSubmitting: false
    }),

    [logout]: (state) => ({
        ...state,
        isLoggedIn: false,
        token: null,
        user: null
    }),

    [completeInitialisation]: (state) => ({
        ...state,
        isInitialised: true
    })
}, defaultState);

export default authentication;