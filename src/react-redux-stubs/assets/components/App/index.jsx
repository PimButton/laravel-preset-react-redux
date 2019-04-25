import React, { Component } from 'react';
import AuthenticatedApp from './components/AuthenticatedApp';
import Routes from 'screens/Routes';

class TestApp extends Component {
    render() {
        return (
            <AuthenticatedApp>
                <Routes />
            </AuthenticatedApp>
        );
    }
}

export default TestApp;