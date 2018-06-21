import { createAction } from 'redux-act';
import { normalize } from 'normalizr';
import snakeCase from 'lodash/snakeCase';
import union from 'lodash/union';
import omit from 'lodash/omit';

import fetch from './fetch';

/**
 * This class provides an abstraction for API endpoints,
 * so that we may easily create actions for particular actions.
 *
 * @class Resource
 */
class Resource {
    constructor() {
        this.actions = {};
        this.types = {
            index: 'INDEX',
            store: 'STORE',
            show: 'SHOW',
            update: 'UPDATE',
            destroy: 'DESTROY'
        };
    }

    createAsyncAction(type, asyncAction, config = {}) {

        // Create actions and thunk
        const actions = this.createActions(type);
        const thunk = this.createThunk(type, asyncAction, config);

        return {
            thunk,
            ...actions
        };

    }

    createActions(type) {

        // Convert the PascalCase classname to SCREAM_CASE
        let name = snakeCase(this.constructor.name).toUpperCase();

        // Create all actions
        const actions = {
            request: createAction(`${name}_${type}_REQUEST`),
            success: createAction(`${name}_${type}_SUCCESS`),
            error: createAction(`${name}_${type}_ERROR`)
        };

        // Store actions in class
        this.actions[type] = actions;

        return actions;

    }

    createThunk(type, asyncAction, config) {

        // The thunk is the function that will be executed
        return (...args) => {
            
            // The thunk always contains an async function that is evaluated on the fly
            return async (dispatch, getState) => {

                // Retrieve the fetch function
                let fetchWrapper = await fetch(dispatch, getState);
    
                // Dispatch the request action
                dispatch(this.actions[type].request());
    
                // Execute the asyncAction provided
                return asyncAction(...args, fetchWrapper, dispatch, getState)
                    .then(response => {
    
                        // Normalize the incoming data if relevant
                        var data = null;
                        switch(type) {
                            case this.types.index:
                            case this.types.store:
                            case this.types.show:
                            case this.types.update:
                                data = normalize(response.data, this.schema);
                        }
    
                        // Dispatch the success action
                        dispatch(this.actions[type].success(response.data));
    
                        // Call the relevant saving/removing actions for this request
                        switch(type) {
                            case this.types.index:
                            case this.types.show:
                            case this.types.update:
                            case this.types.store:
    
                                // Loop through all entities
                                for (let name in data.entities) {
                                    
                                    // Call the add action on the entity with the data
                                    dispatch(this.relatedEntities[name].add(data.entities[name]));
    
                                }
    
                                break;
    
                            case this.types.destroy:
    
                                // Call the remove action on itself
                                dispatch(this.remove(args[0]));
    
                                break;
                                
                        }
    
                        // Allow hook for accessing a successful dispatch
                        if(config.onSuccess) {
                            config.onSuccess(response.data, dispatch, getState, args);
                        }
    
                        // Return the data
                        return response.data;
    
                    })
                    .catch(asyncError => {
    
                        // Dispatch the error
                        dispatch(this.actions[type].error({
                            error: asyncError,
                            response: asyncError.response,
                            message: config.messages.error
                        }));
    
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
    }

    index(asyncAction, config) {
        return this.createAsyncAction(this.types.index, asyncAction, config);
    }

    store(asyncAction, config) {
        return this.createAsyncAction(this.types.store, asyncAction, config);
    }

    show(asyncAction, config) {
        return this.createAsyncAction(this.types.show, asyncAction, config);
    }

    update(asyncAction, config) {
        return this.createAsyncAction(this.types.update, asyncAction, config);
    }

    destroy(asyncAction, config) {
        return this.createAsyncAction(this.types.destroy, asyncAction, config);
    }

    createReducer(userReducer) {
        // Assemble a default state for this entity
        // NOTE: When a userreducer is supplied, these keys will need to be
        // added to the default state for this reducer, as else bad stuffs
        // will happen. 
        const defaultState = {
            loading: false,
            entities: {
                allIds: [],
                byId: {}
            }
        };

        // Create a wrapper function for referencing actions
        // This will catch all exception where a specific action
        // has not been created yet.
        const getAction = (type, action) => this.actions[type] ? this.actions[type][action].getType() : undefined;
 
        // Create the reducer for this entity
        const entityReducer = (state = defaultState, action) => {

            switch(action.type) {
                case getAction(this.types.index, 'request'):
                case getAction(this.types.store, 'request'):
                case getAction(this.types.show, 'request'):
                case getAction(this.types.update, 'request'):
                case getAction(this.types.destroy, 'request'):
                    return {
                        ...state,
                        loading: true
                    };
                
                case getAction(this.types.index, 'success'):
                case getAction(this.types.store, 'success'):
                case getAction(this.types.show, 'success'):
                case getAction(this.types.update, 'success'):
                case getAction(this.types.destroy, 'success'):
                case getAction(this.types.index, 'error'):
                case getAction(this.types.store, 'error'):
                case getAction(this.types.show, 'error'):
                case getAction(this.types.update, 'error'):
                case getAction(this.types.destroy, 'error'):
                    return {
                        ...state,
                        loading: false
                    };

                case this.add.getType():
                    return {
                        ...state,
                        entities: {
                            allIds: union(state.entities.allIds, Object.keys(action.payload)),
                            byId: {
                                ...state.entities.byId,
                                ...action.payload
                            }
                        }
                    };
                
                case this.remove.getType():
                    return {
                        ...state,
                        entities: {
                            allIds: state.entities.allIds.filter(id => id !== action.payload),
                            byId: omit(state.entities.byId, action.payload)
                        }
                    };

                default:
                    return state;
            }
        };

        // Return a wrapper for executing either or both of the reducers
        return ((state, action) => {
            return entityReducer(userReducer ? userReducer(state, action) : state, action);
        });
    }

}

export default Resource;