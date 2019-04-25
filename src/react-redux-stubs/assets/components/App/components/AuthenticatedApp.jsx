import React, { Component } from 'react';
import UnauthenticatedApp from './UnauthenticatedApp';
import Authentication from './Authentication';

class AuthenticatedApp extends Component {
    render() {
        return (
            <UnauthenticatedApp>
                <Authentication>
                    {this.props.children}
                </Authentication>
            </UnauthenticatedApp>
        );
    }
}

export default AuthenticatedApp;