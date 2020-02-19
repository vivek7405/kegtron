import { h, Component } from 'preact';
import style from './style';

export default class AlertModal extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    closeModal = () => {
        self.props.onClose();
    }

    render() {
        let self = this;

        let modal;

        if (self.props.open) {
            modal = <Modal open="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Alert</h5>
                    </div>
                    <div class="modal-body">
                        <p class="lead">{self.props.children}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary mx-auto btn-lg" onClick={self.closeModal}>OK</button>
                    </div>
                </div>
            </Modal>;
        } else {
            modal = "";
        }

        return (
            <div>
                {modal}
            </div>
        );
    }
}