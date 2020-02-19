import { h, Component } from 'preact';
import style from './style';

export default class SpinButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            spin: false
        }
    }

    onButtonClick = (ev, args) => {        
        let self = this;

        if (!self.props.onClick) return;

        self.setState({
            spin: true
        });

        try {
            self.props.onClick
                .apply(null, args)
                .catch(function (e) {
                    let o = ((e.response || {}).data || {}).error || {};
                    alert(o.message || e.message || e);
                })
                .then(function () {
                    self.setState({
                        spin: false
                    });
                });
        } catch {
            setTimeout(t => {
                self.setState({
                    spin: false
                });
            }, 250);
        }
    }

    render() {
        let self = this;

        return (
            <button class={"btn " + (self.props.class || "")} disabled={self.props.disabled || self.state.spin}
                style={self.props.style || ""} ref={self.props.ref} onClick={self.onButtonClick}>
                <i class={"mr-1 fa fa-fw " +
                    (self.state.spin ? "fa-refresh" : self.props.icon || "fa-save") +
                    (self.state.spin ? " fa-spin" : "")}>
                </i>
                {self.props.title || "submit"}
            </button>
        );
    }
}
