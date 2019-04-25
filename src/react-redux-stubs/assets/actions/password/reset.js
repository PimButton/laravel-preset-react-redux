import { createAction } from 'redux-act';
import fetch from 'axios';
import { notify } from 'reapop';

/**
 * Create the action
 */

const request = createAction('RESET_PASSWORD_REQUEST');
const success = createAction('RESET_PASSWORD_SUCCESS');
const error = createAction('RESET_PASSWORD_ERROR');

function resetPassword(data) {
    return function(dispatch) {

        // Dispatch the request action
        dispatch(request);

        return fetch.post('/api/password/reset', data)
            .then(({data}) => {
                dispatch(notify({
                    message: 'Uw wachtwoord is hersteld. U kunt nu inloggen.',
                    dismissible: true,
                    status: 'success',
                    position: 'tc'
                }));
                // Dispatch success action
                dispatch(success(data));

            })
            .catch(err => {
                dispatch(notify({
                    message: 'Er is iets mis gegaan.',
                    dismissible: true,
                    status: 'error',
                    position: 'tc'
                }));
                dispatch(error(err));
                throw err;
            });
    };
}

/**
 * Export the components
 */

export { resetPassword as default };
export { request, success, error };
