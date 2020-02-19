import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Link } from 'preact-router/match';
import style from './style.css';
import SpinButton from '../spin-button';
import BackButton from '../back-button';

export default class Header extends Component {
	constructor(props) {
		super(props);
	}

	logout = () => {
		delete localStorage.ktok;
		this.props.app.setState({
			ktok: null
		});
		Router.route("/");
	};

	render() {
		let self = this;

		return (
			<header class={style.header}>
				<div class="p-2 border-bottom bg-light" style="display: flex; justify-content: space-between; align-items: center;">
					<BackButton app={self.props.app} />
					<b>{self.props.headerName}</b>
					<div class="float-right">
						<SpinButton class="d-inline-block btn-sm ml-3 btn-warning font-weight-light"
							icon="fa-sign-out"
							title="logout"
							onClick={self.logout} />
					</div>
				</div>
			</header>
		);
	}
}

