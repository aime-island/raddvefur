import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Button, Radio } from '../../ui/ui';
import Modal, { ModalButtons } from '../../modal/modal';
import { InfoIcon, CautionIcon } from '../../ui/icons';
import {
  Institution,
  GenderStat,
  InstitutionStat,
} from '../../../stores/competition';
import API from '../../../services/api';

import './institution-modal.css';
import './scrollable-modal.css';
import SexChart from './gender-chart';

interface State {
  genderDistribution: GenderStat[];
}

const SECONDS = 6.5;

interface Props {
  setShowInstitutionModal: () => void;
  institution: Institution;
  stats: InstitutionStat;
  api: API;
}

export default class InstitutionModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      genderDistribution: null,
    };
  }

  componentDidMount = async () => {
    const { api, institution } = this.props;
    const genderDistribution = await api.getInstitutionGender(institution.code);
    this.setState({
      genderDistribution: genderDistribution,
    });
  };

  private close = () => {
    this.props.setShowInstitutionModal();
  };

  render() {
    const { genderDistribution } = this.state;
    const { institution, stats } = this.props;
    const hours = (stats.count * SECONDS) / 3600;
    return (
      <Modal innerClassName="scrollable-modal" onRequestClose={this.close}>
        <h1 className="title">{institution.name}</h1>
        <div className="institution-content">
          <div className="stats">
            <ul className="number-stats">
              <li>
                <span>{stats.count}</span>{' '}
                {stats.count == 1 ? 'lesin setning' : 'lesnar setningar'}
              </li>
              <li>
                <span>{stats.users}</span>{' '}
                {stats.users == 1 ? 'þátttakandi' : 'þátttakendur'}
              </li>
              <li>
                <span>{Math.max(hours, 0.1).toFixed(1)}</span>{' '}
                {hours < 1.05 ? 'klukkustund' : 'klukkustundir'}
              </li>
            </ul>
            <div className="pie-chart">
              {genderDistribution && (
                <SexChart genderDistribution={genderDistribution} />
              )}
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
