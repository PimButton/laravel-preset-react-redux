import { createAction } from 'redux-act';
import localforage from 'localforage';
import { persistor } from 'components/App/components/UnauthenticatedApp';

/**
 * Create action
 */

import completeInitialisation from './initialise';

const logout = createAction('USER_LOGOUT');

function logoutUser() {
    // Clear the persisted state
    persistor.purge();
    persistor.flush();
    
    return async function(dispatch) {

        // Logout the user
        await dispatch(logout());

        // Complete the initialisation
        dispatch(completeInitialisation());

        // Clear local storage
        localforage.clear();

    };
}

export default logoutUser;
export { logout };
