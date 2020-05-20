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

import { AgeStat, GenderStat, TimelineStat } from '../../../stores/competition';

import AgeChart from './charts/age-chart';
import SexChart from './charts/gender-chart';
import TimelineChart from './charts/timeline-chart';
import Leaderboard from '../competition/leaderboard';
import './stats.css';

interface PropsFromState {
  api: API;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

interface State {
  ageStat: AgeStat[];
  genderStat: GenderStat[];
  timelineStat: TimelineStat[];
}

class StatsPage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      ageStat: [],
      genderStat: [],
      timelineStat: [],
    };
  }

  componentDidMount = async () => {
    this.statsToState();
  };

  private statsToState = async () => {
    const { api } = this.props;
    const ageStat = await api.getCompetitionAge();
    const genderStat = await api.getCompetitionGender();
    const timelineStat = await api.getCompetitionTimeline();

    this.setState({
      ageStat,
      genderStat,
      timelineStat,
    });
  };

  render() {
    const { ageStat, genderStat, timelineStat } = this.state;

    return (
      <div className="stats-container">
        <h2 className="title">Lestrarkeppni Grunnskólanna vorið 2020</h2>
        <p>
          Lestrarkeppni grunnskólana í Samróm stóð yfir frá 16.apríl til 10. maí
          2020. Þar kepptust nemendur, starfsmenn og foreldrar í fjölda lesinna
          setninga í Samróm. Keppt var í tveim deildum annars vegar milli skóla
          sem voru með fleiri en 450 nemendur og hins vegar milli skóla sem voru
          með færri en 450 nemendur.
        </p>
        <p>
          Í heildina tóku <span>1430</span> þátt frá <span>130</span> skólum
          þátt og lásu þau í heildina um <span>144 þúsund setningar.</span> Það
          er vægast sagt frábær árangur og fara miklar þakkir til allra sem tók
          þátt.
        </p>
        <p>
          Keppnin hófst rólega og lengi vel voru það nokkrir vaskir nemendur sem
          komu sínum skóla í forystu en um miðbik keppninnar fór að færast hiti
          í leikana og nokkrir skólar mörkuðu sér afgerandi stöðu.
        </p>
        <div className="chart">
          <h3>Fjöldi innlesinna setninga eftir degi upplestrar</h3>
          <TimelineChart />
        </div>
        <p>
          Skólarnir sem lásu mest í hvorum flokki voru Hraunvallaskóla og
          Smáraskóli.
        </p>
        <div className="gap">
          <h3>LEADERBOARDS</h3>
        </div>
        <p>Hérna segjum við eitthvað um aldur þáttakenda.</p>
        <div className="chart">
          <h3>Fjöldi innlesinna setninga eftir aldri upplesara</h3>
          <AgeChart />
        </div>
        <p>Ef við skoðum heildartölur þá voru stelpur duglegastar að lesa.</p>
        <div className="chart">
          <h3>Fjöldi innlesinna setninga eftir kyni upplesara</h3>
          <SexChart genderDistribution={genderStat} />
        </div>
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
