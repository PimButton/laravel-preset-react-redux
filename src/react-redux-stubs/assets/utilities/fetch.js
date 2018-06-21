import axios from 'axios';
import refreshToken from 'actions/authentication/refresh';
import logoutUser from 'actions/authentication/logout';

/**
 * Fetch an endpoint with the given parameters
 *
 * @export
 * @param {any} endpoint
 * @param {any} config
 * @param {any} token
 * @returns {Promise}
 */
async function fetch(dispatch, getState) {

    // Create default request
    let config = {
        headers: {
            'Accept': 'application/json'
        },
        baseURL: '/api'
    };

    // Retrieve token
    let token = getState().authentication.token;

    // Check if we need to do token stuff
    if(token) {

        // Check if the token is expired
        if(new Date(token.expires_at) < new Date()) {
            try {
                token = await dispatch(refreshToken());
            } catch($error) {
                dispatch(logoutUser);
            }
        }

        // Add token to header
        config.headers = Object.assign({}, config.headers, {
            'Authorization': `Bearer ${token.access_token}`
        });

    }

    return axios.create(config);

}

export default fetch;