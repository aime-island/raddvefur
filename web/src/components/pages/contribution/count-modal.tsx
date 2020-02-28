import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Button, Radio } from '../../ui/ui';
import Modal, { ModalButtons } from '../../modal/modal';
import { InfoIcon, CautionIcon } from '../../ui/icons';

import './count-modal.css';

interface State {
  count: number;
}

interface Props {
  setShowCountModal: () => void;
  setSpeakCount: (count: number) => void;
}

const options = [
  { text: '5', value: 5 },
  { text: '15', value: 15 },
  { text: '30', value: 30 },
];

export default class CountModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  state: State = {
    count: 15,
  };

  componentDidMount = () => {
    this.props.setSpeakCount(15);
  };

  render() {
    return (
      <Modal onRequestClose={this.props.setShowCountModal}>
        <Localized id="countmodal-title" className="form-title">
          <h1 className="title" />
        </Localized>
        <Radio
          options={options}
          name={'CountRadio'}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            this.props.setSpeakCount(parseInt(event.target.value));
          }}
        />
        <div className="cookie-modal">
          <div className="toggle-with-info">
            <div className="info">
              <InfoIcon />
              <div className="count-text">
                <span>Ath.</span> Þú getur alltaf yfirfarið og endurupptekið{' '}
                <span>síðustu 5 upptökur.</span>
              </div>
            </div>
          </div>

          <Button
            rounded
            outline
            className="btn-grn"
            onClick={this.props.setShowCountModal}>
            Áfram
          </Button>
        </div>
      </Modal>
    );
  }
}
