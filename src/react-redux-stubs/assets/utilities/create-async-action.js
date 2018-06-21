import { createAction } from 'redux-act';
import fetch from './fetch';

/**
 * Create an async action and corresponding status actions
 *
 * @param {String} name
 * @param {Function} asyncAction
 * @param {Object} config
 */
function createAsyncAction(name, asyncAction, config = {}) {

    // Check if name is all-uppercase
    if(name !== name.toUpperCase()) {
        throw new Error(`Action name must be in uppercase! Received: '${name}'`);
    }

    // Create all actions
    const request = createAction(name + '_REQUEST');
    const success = createAction(name + '_SUCCESS');
    const error = createAction(name + '_ERROR');

    // Create the thunked action
    const thunk = function (...args) {

        return async function(dispatch, getState) {

            // Retrieve the fetch function
            let fetchWrapper = await fetch(dispatch, getState);

            // Dispatch the request action
            dispatch(request());

            // Execute the asyncAction provided
            return asyncAction(...args, fetchWrapper, dispatch, getState)
                .then(response => {

                    // Dispatch the success action
                    dispatch(success(response.data));

                    // Allow hook for accessing a successful dispatch
                    if(config.onSuccess) {
                        config.onSuccess(response.data, dispatch, getState, args);
                    }

                    // Return the data
                    return response.data;

                })
                .catch(asyncError => {

                    // Dispatch the error
                    dispatch(error(asyncError.response));

                    // Allow hook for accessing the error handler
                    if(config.onError) {
                        config.onError(asyncError, dispatch, getState);
                    }

                    // Propagate the error so that components that depend on this promise
                    // do not mistakenly assume that everything went right
                    throw asyncError;

                });

        };

    };

    // Return the actions and the thunk
    return {
        request,
        success,
        error,
        thunk
    };

}

export default createAsyncAction;
