import React, { Component } from 'react';
import { Switch } from 'react-router';
import { AuthenticatedRoute, UnauthenticatedRoute } from 'components/Route';

/**
 * Import pages and routes
 */

import Home from './Home';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <UnauthenticatedRoute path='/' component={Home} />
            </Switch>
        );
    }
}

export default Routes;