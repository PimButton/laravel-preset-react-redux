import React, { Component } from 'react';
import { Switch, Route } from 'react-router';

/**
 * Import pages and routes
 */

import Home from './Home';

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route path='/' component={Home} />
            </Switch>
        );
    }
}

export default Routes;