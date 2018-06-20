/**
 * Import actions
 */

//

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

function authentication(state = defaultState, action) {
    switch(action.type) {
        default:
            return state;
    }
}

export default authentication;