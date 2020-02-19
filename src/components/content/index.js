import { h, Component } from 'preact';
import { Router } from 'preact-router';
import style from './style.css';

import Sites from '../../routes/sites';
import Site from '../../routes/site';
import AddDevice from '../../routes/add-device';
import Account from '../../routes/account';
import Login from '../../routes/login';
import Reports from '../../routes/reports';
import Settings from '../../routes/settings';
import Keg from '../../routes/keg';

export default class Content extends Component {
    constructor(props) {
        super(props);
    }

    /** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
    handleRoute = e => {
        this.currentUrl = e.url;
    };

    render() {
        let self = this;

        return (
            <div class={style.content}>
                <Router onChange={self.handleRoute}>
                    <Login app={self.props.app} path="/" />
                    <Sites app={self.props.app} path="/sites" />
                    <Site app={self.props.app} path="/sites/:name" />
                    <AddDevice app={self.props.app} path="/add-device" />
                    <Reports app={self.props.app} path="/reports" />
                    <Account app={self.props.app} path="/account" />
                    <Settings app={self.props.app} path="/config/:name/:id/:port" />
                    <Keg app={self.props.app} path="/sites/:name/:id/:port" />
                </Router>
            </div>
        );
    }
}
