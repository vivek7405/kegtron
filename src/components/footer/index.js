import { h, Component } from 'preact';
import { Link } from 'preact-router/match';
import style from './style.css';

export default class Footer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let self = this;

        return (
            <footer class={style.footer}>
                <nav class="d-flex align-items-stretch border-top">
                    <Link activeClassName={style.active} href="/sites" onClick={function () { self.props.app.setState({ headerName: "Sites" }) }}>
                        <span class="fa-fw fa fa-home" style="width: 2em" />
                        <div class="small">Sites</div>
                    </Link>
                    <Link activeClassName={style.active} href="/add-device" onClick={function () { self.props.app.setState({ headerName: "Add Device" }) }}>
                        <span class="fa-fw fa fa-plus-circle" style="width: 2em" />
                        <div class="small">Add Device</div>
                    </Link>
                    <Link activeClassName={style.active} href="/reports" onClick={function () { self.props.app.setState({ headerName: "Reports" }) }}>
                        <span class="fa-fw fa fa-file-text" style="width: 2em" />
                        <div class="small">Reports</div>
                    </Link>
                    <Link activeClassName={style.active} href="/account" onClick={function () { self.props.app.setState({ headerName: "Account" }) }}>
                        <span class="fa-fw fa fa-user" style="width: 2em" />
                        <div class="small">Account</div>
                    </Link>
                </nav>
            </footer>
        );
    }
}
