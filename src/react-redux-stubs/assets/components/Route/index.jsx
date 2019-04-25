import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Route as UnconnectedRoute,
    Redirect
} from 'react-router';

/**
 * Request state from the Redux store
 */

function mapStateToProps(state) {
    return {
        isLoggedIn: state.authentication.isLoggedIn,
        authentication: state.authentication,
        router: state.router
    };
}

export const Route = connect(mapStateToProps)(UnconnectedRoute);

class UnconnectedProtectedRoute extends Component {

    constructor(props) {
        super(props);
        this.renderRoute = this.renderRoute.bind(this);
    }

    renderRoute(props) {

        // If the route requires the user to be unauthenticated
        // and the user is logged in, redirect to the front-page
        /*
        if(this.props.unauthenticated && this.props.isLoggedIn) {
            return <Redirect to='/' />;
        } */

        // If the user is not logged in, redirect to login page
        if(!this.props.unauthenticated && !this.props.isLoggedIn) {
            return <Redirect to='/inloggen' />;
        }

        // If we were supplied a render function, execute it
        if(this.props.render) {
            return this.props.render();
        }

        // Else render the supplied component
        const Component = this.props.component;
        return <Component {...props} />;

    }

    render() {
        const { component, render, ...props } = this.props;

        return (
            <Route render={this.renderRoute}
                {...props} />
        );
    }
}

export const AuthenticatedRoute = connect(mapStateToProps)(UnconnectedProtectedRoute);

class UnauthenticatedRoute extends Component {
    render() {
        return (
            <AuthenticatedRoute unauthenticated={true}
                {...this.props} />
        );
    }
}

export { UnauthenticatedRoute };