import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Link } from 'preact-router/match';
import style from './style.css';

export default class BackButton extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let self = this;

        let rndr;

        if (self.props.app.state.backlink) {
            rndr = <a href={self.props.app.state.backlink}>
                <span class="fa fa-arrow-left mr-2" />back
            </a>;
        } else {
            rndr = <img src="/assets/images/KegtronLogoBlack.png" height="24" />;
        }

        return (
            <span class="xbg-warning d-inline-block" style="min-width: 7em;">
                {rndr}
            </span>
        );
    }
}
