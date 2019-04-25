import createAsyncAction from 'utilities/create-async-action';

/**
 * Create the action
 */

const { 
    thunk, 
    request, 
    success, 
    error 
} = createAsyncAction({
    name: 'RETRIEVE_AUTHENTICATED_USER',
    asyncAction: retrieveAuthenticatedUser
});

function retrieveAuthenticatedUser(fetch) {
    return fetch.get('api/auth/user');
}

/**
 * Export the components
 */

export default thunk;
export { request, success, error };
