import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Button, Radio } from '../../ui/ui';
import Modal, { ModalButtons } from '../../modal/modal';
import { InfoIcon, CautionIcon } from '../../ui/icons';
import { LocaleLink } from '../../locale-helpers';
import './consent.css';

class ConsentSuccess extends React.Component {
  private onClose = () => {
    window.location.href = 'https://www.samromur.is';
  };

  render() {
    return (
      <Modal onRequestClose={this.onClose}>
        <Localized id="consent-success-title" className="form-title">
          <h1 className="title" />
        </Localized>
        <div className="text">
          <Localized id="consent-success">
            <span />
          </Localized>
        </div>
        <ModalButtons>
          <Button rounded outline onClick={this.onClose}>
            Áfram
          </Button>
        </ModalButtons>
      </Modal>
    );
  }
}

export default ConsentSuccess;
