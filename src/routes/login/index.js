import { h, Component } from 'preact';
import { Router } from 'preact-router';
import SpinButton from '../../components/spin-button';
import Toggler from '../../components/toggler';
import style from './style';
import Configuration from '../../configuration';
import GlobalAccess from '../../global-access';
const axios = require('axios').default;

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            pass: ""
        }
    }

    componentDidMount = () => {
        let self = this;

        if (localStorage.ktok) {
            Router.route("/sites");
        }

        window.app = self;
        self.state.devices = {};

        // Figure out access token.
        // mDash registration calls us with ?creds=USER:PASS
        // Add device page cass us with ?access_token=ACCESS_TOKEN
        // And, access_token could be saved locally in localStorage.

        var opts = {},
            access_token = "";
        var m = location.href.match(/\?(\w+)=(.+)$/);
        if (m && m[1] == "creds" && m[2]) {
            // We're called with ?creds=USER:PASS. Set up basic auth
            opts.headers = {
                Authorization: "Basic " + btoa(decodeURIComponent(m[2]))
            };
        } else if (m && m[1] == "access_token" && m[2]) {
            access_token = m[2];
        }
        if (!access_token) access_token = localStorage.ktok;
        var qs = access_token ? "?access_token=" + access_token : "";

        if (opts.headers || qs) {
            axios
                .get(Configuration.mdashURL + "/customer" + qs, opts)
                .then(function (res) {
                    self.login(res.data);
                })
                .catch(function (e) { });
        }
    }

    login = (u) => {
        let self = this;

        if (u && u.token) {
            localStorage.ktok = u.token;
            self.props.app.setState({
                ktok: u.token
            });
            GlobalAccess.getDevices(self.props.app);
            GlobalAccess.getAllServings(self.props.app);
        }

        // Strip credentials from the URL
        if (location.href.indexOf("?") > 0) {
            location.href = location.href.replace(/\?.*/, "");
        }
    };

    onEmailInput = (ev) => {
        this.setState({
            email: ev.target.value
        });
    }

    onPasswordInput = (ev) => {
        this.setState({
            pass: ev.target.value
        });
    }

    onSignIn = (ev) => {
        let self = this;

        return axios
            .get(Configuration.mdashURL + "/customer", {
                headers: {
                    Authorization: "Basic " + btoa(self.state.email + ":" + self.state.pass)
                }
            })
            .then(function (res) {
                self.login(res.data);
                Router.route("/sites");
            })
            .catch(function (e) {
                var o = ((e.response || {}).data || {}).error || {};
                alert(o.message || e.message || e);
            });
    }

    onSendInvitation = (ev) => {
        let self = this;

        let app_id = Configuration.appID || location.pathname.split("/")[2] || "setme";

        let args = {
            email: self.state.email,
            url: Configuration.mdashURL,
            from: "Kegtron",
            redir: location.href,
            app_id: app_id,
            text: "Thank you for registering with Kegtron.\n" +
                "Your login: EMAIL\n" +
                "Your password: PASS\n" +
                "Click on the link below to activate your account " +
                "and login:\nREGLINK"
        };

        return axios
            .post(Configuration.mdashURL + "/invite", args)
            .then(function (res) {
                alert("Thank you! Check your inbox and login.");
                self.setState({
                    email: ""
                });
                location.reload();
            })
            .catch(function (e) {
                var o = ((e.response || {}).data || {}).error || {};
                alert(o.message || e.message || e);
            });
    }

    render() {
        let self = this;

        return (
            <div class={style.login} style="width:100%; height: 100%; background-color: #000">
                <div class="mx-auto bg-light rounded" style="max-width: 480px">
                    <img src="images/Kegtron Cloud Dashboard - bw.png" class="img-fluid" />

                    <div class="form p-3 rounded w-100">
                        <input type="email"
                            placeholder="Email"
                            class="my-2 form-control"
                            onInput={self.onEmailInput}>
                        </input>

                        <input type="password"
                            placeholder="Password"
                            class="my-2 form-control"
                            onInput={self.onPasswordInput}>
                        </input>

                        <SpinButton class="btn-block btn-secondary"
                            disabled={!self.state.email || !self.state.pass}
                            title="Sign In"
                            style="backgroundColor: #000"
                            icon="fa-sign-in"
                            onClick={self.onSignIn}>
                        </SpinButton>

                        <div class="mt-2">
                            No account yet?

                            <Toggler text=" Register" class="black-text">
                                <div>
                                    <input type="email"
                                        placeholder="Email"
                                        class="my-2 form-control"
                                        onInput={self.onEmailInput}>
                                    </input>

                                    <SpinButton class="btn-block btn-secondary"
                                        icon="fa-envelope"
                                        style="backgroundColor: #000"
                                        title="Send invitation"
                                        disabled={!self.state.email}
                                        onClick={self.onSendInvitation}>
                                    </SpinButton>
                                </div>
                            </Toggler>
                        </div>

                        <div class="mt-2">
                            <small>
                                By using this service, you agree to the
                                <a href="https://policies.google.com/terms" class="black-text"> terms</a>
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}
