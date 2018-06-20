import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router'; 

/**
 * Import components
 */

import { Overlay } from 'components/Loading';

/**
 * Retrieve a part of the store
 */

const mapStateToProps = (state) => {
    return {
        isInitialised: state.authentication.isInitialised
    };
};

/**
 * Inject actions into the components
 */

import retrieveAuthenticatedUser from 'actions/authentication/retrieve';

const mapDispatchToProps = {
    retrieveAuthenticatedUser
};

class Authentication extends Component {
    componentDidMount() {
        this.props.retrieveAuthenticatedUser();
    }

    render() {
        if(!this.props.isInitialised) {
            return <Overlay />;
        }
        
        return this.props.children;
    }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(Authentication));