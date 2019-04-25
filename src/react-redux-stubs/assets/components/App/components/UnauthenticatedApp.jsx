import React, { Component, Fragment } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import ReduxThunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import NotificationsSystem from 'reapop';
import RootReducer from 'reducers';
import theme from 'components/UI/Notification/theme';

import AppLoader from 'components/App/components/Loader/Loader';

/**
 * Define Redux middleware
 */

export const history = createHistory();
const middleware = [
    ReduxThunk,
    routerMiddleware(history)
];

/**
 * Activate a logger when on development environments
 */

if (process.env.NODE_ENV !== 'production') {
    middleware.push(require('redux-logger').createLogger());
}

/**
 * Create new Redux store
 */

const store = createStore(
    RootReducer,
    applyMiddleware(...middleware)
);

export const persistor = persistStore(store);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={<AppLoader />}>
                    <ConnectedRouter history={history}>
                        <Fragment>
                            {this.props.children}
                            <NotificationsSystem theme={theme} position='tc'/>
                        </Fragment>
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;
