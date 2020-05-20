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

import {
  Institution,
  Institutions,
  InstitutionStat,
  AgeStat,
  GenderStat,
  TimelineStat,
} from '../../../stores/competition';

import AgeChart from './charts/age-chart';
import SexChart from './charts/gender-chart';
import TimelineChart from './charts/timeline-chart';
import Leaderboard from './leaderboard';
import './stats.css';

interface PropsFromState {
  api: API;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

interface State {
  ageStat: AgeStat[];
  genderStat: GenderStat[];
  institutions: Institution[];
  institutionStats: InstitutionStat[];
  timelineStat: TimelineStat[];
}

class StatsPage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      ageStat: [],
      genderStat: [],
      institutions: [],
      institutionStats: [],
      timelineStat: [],
    };
  }

  componentDidMount = async () => {
    this.statsToState();
  };

  private statsToState = async () => {
    const { api } = this.props;
    //const institutions: Institutions = await api.fetchInstitutions();
    //const institutionStats: InstitutionStat[] = await api.getLeaderboard();
    //console.log(institutionStats);
    //const ageStat = await api.getCompetitionAge();
    const genderStat = await api.getCompetitionGender();
    //const timelineStat = await api.getCompetitionTimeline();

    this.setState({
      //ageStat,
      genderStat,
      //institutions: institutions.institutions,
      //institutionStats,
      //timelineStat,
    });
  };

  render() {
    const {
      ageStat,
      genderStat,
      institutions,
      institutionStats,
      timelineStat,
    } = this.state;

    return (
      <div className="stats-container">
        <h2 className="title">Uppgjör lestrarkeppni grunnskóla vorið 2020</h2>
        <p>
          Lestrarkeppni grunnskóla í Samróm stóð yfir frá 16. apríl til 10. maí
          2020. Þar kepptu nemendur, starfsmenn og foreldrar í fjölda lesinna
          setninga í Samróm. Keppt var í tveimur deildum en í annarri voru
          skólar með fleiri en 450 nemendur og í hinni skólar með færri en 450
          nemendur.
        </p>
        <p>
          Í heildina tóku <span>1430</span> manns þátt fyrir hendur{' '}
          <span>130</span> skóla og lásu þau í kringum{' '}
          <span>144 þúsund setningar</span>. Það er vægast sagt frábær árangur
          og fara miklar þakkir til allra sem tók þátt.
        </p>
        <div className="winners-chart">
          <h3>Sigurvegarar</h3>
          <p>
            Skólarnir sem lásu mest í hvorum flokki voru Hraunvallaskóla og
            Smáraskóli en nemendur Hraunvallaskóla lásu upp <span>49.910</span>{' '}
            setningar og nemendur Smáraskóla <span>37.655</span> setningar. Þar
            af lásu þrír nemendur yfir <span>5.000</span> setningar hver en sá
            sem lét mest í sér heyra las upp <span>14.419</span> setningar.
          </p>
        </div>
        <div className="chart">
          <h3>Fjöldi innlesinna setninga eftir degi upplestrar</h3>
          <p>
            Keppnin hófst rólega og lengi vel voru það nokkrir vaskir nemendur
            sem komu sínum skólum í forystu en um miðbik keppninnar fór að
            færast hiti í leikana og nokkrir skólar mörkuðu sér afgerandi stöðu.
          </p>
          <TimelineChart />
        </div>

        <div className="chart">
          <h3>Fjöldi innlesinna setninga eftir aldri upplesara</h3>
          <p>
            Eins og sjá má þá lásu nemendurnir sjálfir upp flestar upptökur en
            foreldrar og kennarar studdu þá vel.
          </p>
          <AgeChart />
        </div>

        <div className="chart">
          <h3>Fjöldi innlesinna setninga eftir kyni upplesara</h3>
          <p>
            Ef við skoðum heildartölur þá voru stelpurnar lang duglegastar að
            lesa.
          </p>
          <div className="gender-chart">
            <SexChart genderDistribution={genderStat} />
          </div>
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
