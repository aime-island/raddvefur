import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';

import SexChart from './charts/gender-chart';

import './stats.css';

interface PropsFromState {
  api: API;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

type State = {};

class StatsPage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {};
  }

  componentDidMount = async () => {
    this.statsToState();
  };

  private statsToState = async () => {
    const { api } = this.props;
    const something = await api.getCompetitionTimeline();
    console.log(something);
  };

  render() {
    return <div className="stats-container">{/* <SexChart /> */}</div>;
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default localeConnector(
  withLocalization(connect<PropsFromState>(mapStateToProps)(StatsPage))
);
