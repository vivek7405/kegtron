import { h, Component } from 'preact';
import style from './style';

export default class Toggler extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expanded: props.expanded || false
        }
    }

    onToggle = (ev) => {
        let self = this;

        ev.preventDefault();
        self.setState({
            expanded: !self.state.expanded
        });
    }

    render() {
        let self = this;

        var div = self.state.expanded ?
            self.props.children :
            self.props.dnone ?
                h("div", {
                    class: "d-none"
                }, self.props.children) :
                null;

        return (
            <span class={self.props.class || ""} style="z-index: 999">
                <a onClick={self.onToggle} href="#">
                    {self.props.text || ""}
                    <i class={"ml-2 fa " + (self.state.expanded ? "fa-caret-down" : "fa-caret-right")}></i>
                </a>
                {self.props.extra}
                {self.state.expanded ? self.props.children : self.props.dnone ? <div class="d-none">{self.props.children}</div> : null}
            </span>
        );
    }
}
