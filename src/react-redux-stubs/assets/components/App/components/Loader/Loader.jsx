import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import './Loader.module.scss';

/**
* Import Font Awesome icons
*/

import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import faCircleNotch from '@fortawesome/fontawesome-pro-light/faCircleNotch';

class Loader extends Component {

    render() {
        return (
            <CSSTransition in
                appear
                timeout={0}
                classNames='fade'
                unmountOnExit>
                <div styleName='loader'><FontAwesomeIcon icon={faCircleNotch} spin/></div>
            </CSSTransition>
        );
    }

}

export default Loader;
