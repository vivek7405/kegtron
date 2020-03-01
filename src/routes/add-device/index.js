import { h, Component } from 'preact';
import { Router } from 'preact-router';
import style from './style';
import Configuration from '../../configuration';
import SpinButton from '../../components/spin-button';
const axios = require('axios').default;

export default class AddDevice extends Component {
    unmounted = false;

    constructor(props) {
        super(props);

        this.state = {
            step: 0,
            ssid: "",
            pass: "",
            public_key: ""
        }
    }

    componentDidMount() {
        this.props.app.setState({
            headerName: "Add Device",
            backlink: ""
        });
    }

    componentWillUnmount() {
        this.unmounted = true;
    };

    scan = () => {
        let self = this;

        return new Promise(function (resolve, reject) {
            let attempts = 0;
            let f = function () {
                let error = function (err) {
                    if (!self.unmounted) setTimeout(f, 500);
                };
                let success = function (res) {
                    let key = res.data.result;
                    if (key) {
                        self.setState({
                            step: 1,
                            public_key: key
                        });
                        resolve();
                    } else {
                        reject(res.data.error);
                    }
                };

                axios({
                    url: Configuration.provisionURL + "/GetKey",
                    timeout: Configuration.callTimeoutMilli
                }).then(success, error);
                attempts++;
                console.log("attempt", attempts);
            };
            f();
        });
    }

    onSSIDInput = (ev) => {
        this.setState({
            ssid: ev.target.value
        });
    }

    onPasswordInput = (ev) => {
        this.setState({
            pass: ev.target.value
        });
    }

    configureDeviceWifi = () => {
        let self = this;

        let data = JSON.stringify({
            ssid: self.state.ssid,
            pass: self.state.pass
        });
        return axios({
            method: "POST",
            url: Configuration.provisionURL + "/setup",
            timeout: Configuration.callTimeoutMilli,
            data: data
        }).then(function (res) {
            if (res.data.result) {
                self.setState({
                    step: 2
                });
            } else {
                alert("Error: " + res.data.error);
            }
        });
    }

    registerDevice = () => {
        let self = this;

        let url =
            Configuration.mdashURL +
            "/customer?access_token=" + localStorage.ktok
        return axios
            .get(url)
            .then(function (res) {
                let data = res.data;
                if (!data.pubkeys) data.pubkeys = {};
                data.pubkeys[self.state.public_key] = {};
                return axios({
                    method: "POST",
                    url: url,
                    data: data
                });
            })
            .then(function (res) {
                // Go back to https, now with a registered device
                location.href = "https://" + location.host + location.pathname;
            })
            .catch(function (err) {
                alert(
                    "Error registering device (" +
                    err +
                    "). Join your WiFi network and retry."
                );
            });
    }

    render() {
        let self = this;

        let div;

        if (self.state.step === 0) {
            div = <div>
                <div class="p-2 text-muted font-weight-light lead">
                    Go to your phone settings
                        <br />
                    Join WiFi network Kegtron-XXXX
                        <br />
                    Return to this screen and press the Scan button
                </div>

                <SpinButton class="btn-block btn-primary border font-weight-light"
                    title="Scan"
                    icon="fa-search"
                    onClick={self.scan} />
            </div>;
        } else if (self.state.step === 1) {
            div = <div>
                <a href={location.href} class="link text-decoration-none" onClick={self.setState({ step: 0 })}>
                    <span class="fa fa-arrow-left"></span>
                    back
                </a>

                <div class="p-2 text-muted font-weight-light lead mt-2">
                    Found new device
                </div>

                <input class="form-control mb-2" type="text" placeholder="WiFi network name" onInput={self.onSSIDInput} />

                <input class="form-control mb-2" type="text" placeholder="WiFi password" onInput={self.onPasswordInput} />

                <SpinButton class="btn-block btn-primary font-weight-light"
                    title="Configure device WiFi"
                    icon="fa-save"
                    disabled={!self.state.ssid}
                    onClick={self.configureDeviceWifi} />
            </div>;
        } else if (self.state.step === 2) {
            div = <div>
                <a href={location.href} class="link text-decoration-none" onClick={self.setState({ step: 1 })}>
                    <span class="fa fa-arrow-left"></span>
                    back
                </a>

                <div class="p-2 text-muted font-weight-light lead mt-2">
                    WiFi settings applied. Go to your phone settings,
                    <br />
                    Join back to your WiFi network,
                    <br />
                    Return to this screen and click on Register Device.
                </div>

                <input class="form-control mb-2" type="text" placeholder="WiFi network name" onInput={self.onSSIDInput} />

                <input class="form-control mb-2" type="text" placeholder="WiFi password" onInput={self.onPasswordInput} />

                <SpinButton class="btn-block btn-primary border font-weight-light"
                    title="Register Device"
                    icon="fa-plus-circle"
                    onClick={self.registerDevice} />
            </div>;
        } else {
            div = <div></div>;
        }

        return (
            <div class={style.addDevice}>
                <div class="overflow-auto p-2">
                    {div}
                </div>
            </div>
        );
    };
}