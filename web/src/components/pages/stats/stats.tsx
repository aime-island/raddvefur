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

import ChartContainer from './charts/container';
import AgeGenderChart from './charts/age-gender-chart';
import MilestoneChart from './charts/milestone-chart';
import TimelineChart from './charts/timeline-chart';
import './stats.css';

interface PropsFromState {
  api: API;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

interface State {}

class StatsPage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (
      <div className="stats-container">
        {/* <h1 className="stats-title">Tölfræði</h1> */}
        <ChartContainer title="Upptökur á dag frá gangsetningu söfnunar">
          <TimelineChart />
        </ChartContainer>
        <ChartContainer title="Upptökur eftir aldri og kyni">
          <AgeGenderChart />
        </ChartContainer>
        <ChartContainer title="Áfangar í fjölda upptakna m.v. Máltækniáætlun">
          <MilestoneChart />
        </ChartContainer>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default localeConnector(
  withLocalization(connect<PropsFromState>(mapStateToProps)(StatsPage))
);
