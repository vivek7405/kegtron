import { h, Component } from 'preact';
import style from './style';

export default class MkRowInput extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    stringToString = (s) => {
        return s;
    }

    componentDidMount = () => {
        let self = this;

        self.normalize = self.props.normalize || self.stringToString;
        self.format = self.props.format || self.stringToString;

        self.setState({
            value: self.normalize(self.props.value)
        });
    }

    componentWillReceiveProps = (newProps) => {
        let self = this;

        self.normalize = newProps.normalize || self.stringToString;
        self.format = newProps.format || self.stringToString;

        if (self.props.value !== newProps.value)
            self.setState({
                value: self.normalize(newProps.value)
            });
    }

    handleInput = (e) => {
        let self = this;

        self.setState({
            value: e.target.value
        });

        self.props.onInput(self.format(e.target.value));
    };

    render() {
        let self = this;

        return h(
            "input",
            Object.assign({}, self.props, {
                type: self.props.type || "text",
                value: self.state.value,
                onInput: self.handleInput
            })
        );
    }
}