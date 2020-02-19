import { h, Component } from 'preact';
import MkRowInput from '../mkrow-input';
import style from './style';

export default class MkRow extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    componentDidMount = () => {
        let self = this;

        self.props.extraProps = self.props.extraProps || {};

        this.setState({
            value: self.props.valueResolver(self.props.k, self.props.extraProps.type)
        });
    }

    componentWillReceiveProps = () => {
        let self = this;

        self.props.extraProps = self.props.extraProps || {};
        let newValue = self.props.valueResolver(self.props.k, self.props.extraProps.type);
        if (newValue !== self.state.value) {
            self.setState({
                value: newValue
            });
        }
    }

    render() {
        let self = this;

        return (
            <div class="form-group row my-2">
                <label class="col-form-label col-4">
                    {self.props.label}
                </label>
                <div class={self.props.badge ? "col-3" : "col-8"}>
                    {h(
                        MkRowInput,
                        Object.assign({}, self.props.extraProps, {
                            value: self.state.value,
                            placeholder: self.props.label,
                            // disabled: !!dis || !r.online,
                            class: "form-control",
                            onInput: function (term) {                                
                                // onChange("innerData." + k, term);
                                self.props.onChange("c." + self.props.k, term);
                                if (self.props.k.match(/.volSize$/)) {
                                    // If user changes volSize, automatically set volStart
                                    // to the same value. Allow, however, overwriting
                                    // volStart manually.
                                    var k2 = self.props.k.replace(".volSize", ".volStart");
                                    // onChange("innerData." + k2, term);
                                    self.props.onChange("c." + k2, term);
                                }
                            }
                        })
                    )}
                </div>

                {self.props.badge ? <div class="col-1 d-flex align-items-center">{self.props.badge}</div> : null}
            </div>
        );
    }
}
