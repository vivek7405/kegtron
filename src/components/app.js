import { h, Component } from 'preact';
import { Router } from 'preact-router';
import Header from './header';
import Content from './content';
import Footer from './footer';

export default class App extends Component {
	constructor(props) {
		super(props);

		if (typeof window !== "undefined") {
			this.state = {
				ktok: localStorage.ktok,
				headerName: "Sites",
				backlink: "",
				devices: {},
				servings: {},
				pubkeys: {}
			}
		}
	}

	componentDidMount() {
		if (!localStorage.ktok) {
			Router.route("/");
		}
	}

	render() {
		let self = this;

		let header = "";
		let footer = "";
		if (this.state.ktok) {
			header = <Header app={this} headerName={this.state.headerName} />
			footer = <Footer app={this} />
		} else {
			header = "";
			footer = "";
		}

		return (
			<div id="app">
				{header}
				<Content app={this} />
				{footer}
			</div>
		);
	}
}
