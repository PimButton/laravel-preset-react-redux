import { createAction } from 'redux-act';
import axios from 'axios';

/**
 * Create the action
 */

import retrieveAuthenticatedUser from 'actions/authentication/retrieve';
import logoutUser from 'actions/authentication/logout';

const request = createAction('REFRESH_TOKEN_REQUEST');
const success = createAction('REFRESH_TOKEN_SUCCESS');
const error = createAction('REFRESH_TOKEN_ERROR');

function refreshToken() {

    return async function(dispatch, getState) {

        // Retrieve the refresh token from the state
        const token = getState().authentication.token.access_token;

        // Prepare POST data
        const formData = {
            grant_type: 'refresh_token',
            token
        };

        dispatch(request());

        // Post the request
        return axios.post('/api/auth/refresh', formData)
            .then(async (response) => {
                dispatch(success(response.data));
                dispatch(retrieveAuthenticatedUser());
            })
            .catch(err => {
                dispatch(error(err));
                dispatch(logoutUser());
            });

    };


}

/**
 * Export the components
 */

export { refreshToken as default };
export { request, success, error };
