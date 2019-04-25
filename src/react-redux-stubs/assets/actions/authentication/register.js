import { createAction } from 'redux-act';
import fetch from 'axios';
import loginUser from './login';

/**
 * Create the action
 */

import { push } from 'react-router-redux';

const request = createAction('REGISTER_REQUEST');
const success = createAction('REGISTER_SUCCESS');
const error = createAction('REGISTER_ERROR');

function registerUser(data) {
    return function(dispatch) {

        // Dispatch the request action
        dispatch(request);

        return fetch.post('/api/auth/register', data)
            .then(({response}) => {
                /* dispatch(notify({
                    message: 'Account aangemaakt!',
                    dismissible: true,
                    status: 'success',
                    position: 'tc'
                })); */

                // Dispatch success action
                dispatch(success(response));
            })
            .then(() => dispatch(loginUser(data)))
            .then(() => dispatch(push('/auth/landing')))
            .catch(err => {
            	/*
                dispatch(notify({
                    message: 'Zorg ervoor dat alle velden zijn ingevuld.',
                    dismissible: true,
                    status: 'error',
                    position: 'tc'
                })); */
                dispatch(error(err));
                throw err;
            });
    };
}

/**
 * Export the components
 */

export { registerUser as default };
export { request, success, error };
