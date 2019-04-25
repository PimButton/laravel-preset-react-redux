import { createAction } from 'redux-act';
import fetch from 'axios';
import { notify } from 'reapop';

/**
 * Create the action
 */

const request = createAction('FORGOT_PASSWORD_REQUEST');
const success = createAction('FORGOT_PASSWORD_SUCCESS');
const error = createAction('FORGOT_PASSWORD_ERROR');

function forgotPassword(data) {
    return function(dispatch) {

        // Dispatch the request action
        dispatch(request);

        return fetch.post('/api/password/forgot', data)
            .then(({data}) => {
                dispatch(notify({
                    message: 'U heeft een email ontvangen met een herstel link.',
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

export { forgotPassword as default };
export { request, success, error };
