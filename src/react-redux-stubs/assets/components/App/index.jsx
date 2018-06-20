import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerMiddleware } from 'react-router-redux';
import ReduxThunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';

/**
 * Import components
 */

import Routes from 'pages/Routes';
// import Authentication from './components/Authentication';
import { Overlay } from 'components/Loading';
import RootReducer from 'reducers';


/**
 * Define Redux middleware
 */

const history = createHistory();
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

const persistor = persistStore(store);

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate persistor={persistor} loading={<Overlay />}>
                    <ConnectedRouter history={history}>
                        <Routes />
                    </ConnectedRouter>
                </PersistGate>
            </Provider>
        );
    }
}

export default App;