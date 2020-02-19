import { h, Component } from 'preact';
import { Router } from 'preact-router';
import style from './style';
import Configuration from '../../configuration';
import SpinButton from '../../components/spin-button';
import GlobalAccess from '../../global-access';
const axios = require('axios').default;

export default class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            pass: "",
            pass2: ""
        }
    }

    componentDidMount() {
        this.props.app.setState({
            headerName: "Account",
            backlink: ""
        });
    }    

    onPasswordInput = (ev) => {
        this.setState({
            pass: ev.target.value
        });
    }

    onRetypePasswordInput = (ev) => {
        this.setState({
            pass2: ev.target.value
        });
    }

    onPasswordChange = () => {
        let self = this;

        let ok = confirm("Sure to update your password?");
        if (!ok) return Promise.resolve();

        let url = Configuration.mdashURL + "/customer?access_token=" + encodeURIComponent(localStorage.ktok);
        let data = {
            password: self.state.pass
        };

        return axios({
            method: "POST",
            url: url,
            data: data
        })
            .catch(function () { })
            .then(function () {
                setTimeout(GlobalAccess.getDevices(self.props.app), 250);
            });
    }

    render() {
        let self = this;

        return (
            <div class={style.account}>
                <div class="overflow-auto p-2 font-weight-light">
                    <div class="px-2 my-2">
                        <b>Change Password</b>
                    </div>

                    <hr />
                    
                    <form class="form px-2">
                        <div class="form-group row my-2">
                            <label class="col-form-label col-4">Password</label>
                            <div class="col-8">
                                <input type="password" value={self.state.pass} placeholder="Type Password" class="form-control" onInput={this.onPasswordInput} />
                            </div>
                        </div>
                        <div class="form-group row my-2">
                            <label class="col-form-label col-4">Retype Password</label>
                            <div class="col-8">
                                <input type="password" value={self.state.pass2} placeholder="Type Password" class="form-control" onInput={this.onRetypePasswordInput} />
                            </div>
                        </div>
                    </form>

                    <SpinButton class="btn-block btn-primary mt-3"
                        disabled={!self.state.pass || !self.state.pass2 || self.state.pass != self.state.pass2}
                        icon="fa-save"
                        title="Change Password"
                        onClick={self.onPasswordChange}>
                    </SpinButton>
                </div>
            </div>
        );
    }
}