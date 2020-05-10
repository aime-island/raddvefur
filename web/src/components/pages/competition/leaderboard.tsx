import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Institution, InstitutionStat } from '../../../stores/competition';
import { SortIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';

import './leaderboard.css';
import InstitutionModal from './institution-modal';
import API from '../../../services/api';
import arrow from './images/arrow.png';
import URLS from '../../../urls';
import { Countdown } from './countdown';
import { LocaleLink, useLocale, LocaleNavLink } from '../../locale-helpers';

const divisionA = 'yqnt';
const divisionB = 'n5uo';

interface Props {
  institutions: Institution[];
  stats: InstitutionStat[];
  api: API;
}

interface State {
  hiddenLeaderboard: boolean;
  id: string;
  isDivisional: boolean;
  isA: boolean;
  showInfo: {
    name: boolean;
    users: boolean;
    ratio: boolean;
    count: boolean;
  };
  stats: InstitutionStat[];
  sortByIdentifier: string;
  sortBySequence: boolean;
  selectedInstitution: Institution;
  selectedInstitutionStats: InstitutionStat;
  showInstitutionModal: boolean;
}

export default class Leaderboard extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      hiddenLeaderboard: true,
      id: '',
      isDivisional: false,
      isA: false,
      showInfo: {
        name: false,
        users: false,
        ratio: false,
        count: false,
      },
      selectedInstitution: null,
      selectedInstitutionStats: null,
      stats: [],
      sortByIdentifier: 'count',
      sortBySequence: true,
      showInstitutionModal: false,
    };
  }

  getInstitutionName = (code: string): string => {
    const { institutions } = this.props;
    const institution = institutions.find(
      (item: Institution) => item.code == code
    );
    if (institution) {
      return institution.name;
    } else {
      return 'Skóli';
    }
  };

  getInstitution = (code: string): Institution => {
    const { institutions } = this.props;
    const institution = institutions.find(
      (item: Institution) => item.code == code
    );
    if (institution) {
      return institution;
    } else {
      return null;
    }
  };

  getInstitutionEnrollment = (code: string): number => {
    const { institutions } = this.props;
    const institution = institutions.find(
      (item: Institution) => item.code == code
    );
    if (institution) {
      return institution.enrollment;
    } else {
      return 1;
    }
  };

  addStatsToState = (stats: InstitutionStat[]) => {
    const location = window.location.href;
    const id = location.slice(-4);
    let i = 0;
    let newstats = stats.filter((stat: InstitutionStat) => {
      const enrollment = this.getInstitutionEnrollment(stat.institution);
      if (id == divisionA) {
        return enrollment >= 450;
      } else if (id == divisionB) {
        return enrollment < 450;
      } else {
        return true;
      }
    });
    newstats = newstats.map((stat: InstitutionStat) => {
      i += 1;
      return {
        ...stat,
        rank: i,
        ratio: stat.count / this.getInstitutionEnrollment(stat.institution),
      };
    });
    if (id == divisionA || id == divisionB) {
      this.setState({
        isDivisional: true,
        isA: id == divisionA,
        stats: newstats,
      });
    } else {
      this.setState({
        isDivisional: false,
        stats: newstats,
      });
    }
  };

  componentDidMount = () => {
    const location = window.location.href;
    const id = location.slice(-4);
    this.setState({
      id: id,
    });
    const { stats } = this.props;
    if (stats.length != 0) {
      this.addStatsToState(stats);
    }
  };

  componentDidUpdate = () => {
    const location = window.location.href;
    const id = location.slice(-4);
    if (id != this.state.id) {
      this.setState({
        id: id,
      });
      const { stats } = this.props;
      if (stats.length != 0) {
        this.addStatsToState(stats);
      }
    }
  };

  sort = (identifier: string, sequence: boolean) => {
    const { stats } = this.state;
    let newStats;
    if (
      identifier == 'count' ||
      identifier == 'users' ||
      identifier == 'ratio'
    ) {
      if (sequence) {
        newStats = stats.sort((a, b) => b[identifier] - a[identifier]);
      } else {
        newStats = stats.sort((a, b) => a[identifier] - b[identifier]);
      }
    }
    this.setState({
      stats: newStats,
    });
  };

  setSortBy = (id: string) => {
    const { hiddenLeaderboard } = this.state;
    if (hiddenLeaderboard) {
      return;
    }
    const { sortByIdentifier, sortBySequence } = this.state;
    let sequence;
    if (sortByIdentifier == id) {
      this.setState({
        sortBySequence: !this.state.sortBySequence,
      });
      sequence = !sortBySequence;
    } else {
      this.setState({
        sortByIdentifier: id,
        sortBySequence: true,
      });
      sequence = true;
    }
    this.sort(id, sequence);
  };

  showInfo = (e: any) => {
    const { hiddenLeaderboard } = this.state;
    if (hiddenLeaderboard) {
      return;
    }
    const name = e.target.id;
    this.setState({
      showInfo: {
        name: false,
        users: false,
        ratio: false,
        count: false,
        [name]: true,
      },
    });
  };

  hideInfo = () => {
    const { hiddenLeaderboard } = this.state;
    if (hiddenLeaderboard) {
      return;
    }
    this.setState({
      showInfo: {
        name: false,
        users: false,
        ratio: false,
        count: false,
      },
    });
  };

  renderInfo = (info: String, left: boolean) => (
    <div className={left ? 'info-menu-left' : 'info-menu'}>
      <ul>{info}</ul>
      <div style={{ height: 10 }}>
        <div className={left ? 'triangle-left' : 'triangle'} />
      </div>
    </div>
  );

  setShowInstitutionModal = () => {
    this.setState({
      showInstitutionModal: !this.state.showInstitutionModal,
    });
  };

  showInstitutionModal = (institution: Institution, stats: InstitutionStat) => {
    const { hiddenLeaderboard } = this.state;
    if (hiddenLeaderboard) {
      return;
    }
    this.setState({
      selectedInstitution: institution,
      selectedInstitutionStats: stats,
    });
    this.setShowInstitutionModal();
  };

  renderStats = (stats: InstitutionStat[]) => {
    return stats.map((stat: InstitutionStat) => {
      const institution = this.getInstitution(stat.institution);
      return (
        <div
          key={stat.institution}
          className="leaderboard-item"
          onClick={() => this.showInstitutionModal(institution, stat)}>
          <span>{stat.rank}</span>
          <span>{this.getInstitutionName(stat.institution)}</span>
          <span className="stat">{stat.users}</span>
          <span className="stat">{Math.max(stat.ratio, 0.1).toFixed(1)}</span>
          <span className="stat stat-prop stat-main">{stat.count}</span>
        </div>
      );
    });
  };

  render() {
    const {
      hiddenLeaderboard,
      isDivisional,
      isA,
      selectedInstitution,
      selectedInstitutionStats,
      stats,
      showInfo,
      showInstitutionModal,
    } = this.state;
    const { api } = this.props;
    const heading = isDivisional
      ? isA
        ? 'Taflan sýnir skóla sem hafa tekið þátt og eru með yfir 450 nemendur.'
        : 'Taflan sýnir skóla sem hafa tekið þátt og eru með undir 450 nemendur.'
      : 'Taflan sýnir alla skóla sem hafa tekið þátt.';
    return (
      <>
        {showInstitutionModal && (
          <InstitutionModal
            setShowInstitutionModal={this.setShowInstitutionModal}
            institution={selectedInstitution}
            api={api}
            stats={selectedInstitutionStats}
          />
        )}
        <div className="leaderboard-container">
          <h3 className="heading">{heading}</h3>
          <div className="leaderboard-header leaderboard-item">
            <span>#</span>
            <div
              onMouseEnter={e => this.showInfo(e)}
              onMouseLeave={this.hideInfo}
              id="name">
              <p>Skóli</p>
              {/* <div className="mobile-hint">
                <img src={arrow} />
              </div> */}
              <div className="stat">
                {showInfo.name &&
                  this.renderInfo(
                    'Smelltu á nafn skóla til þess að fá frekari upplýsingar',
                    true
                  )}
              </div>
            </div>
            <div
              onMouseEnter={e => this.showInfo(e)}
              onMouseLeave={this.hideInfo}
              className="stat"
              id="users"
              onClick={(e: any) => this.setSortBy(e.target.id)}>
              Keppendur
              {showInfo.users &&
                this.renderInfo(
                  'Fjöldi keppenda sem hafa lesið inn fyrir skóla.',
                  false
                )}
            </div>
            <div
              onMouseEnter={e => this.showInfo(e)}
              onMouseLeave={this.hideInfo}
              onClick={(e: any) => this.setSortBy(e.target.id)}
              id="ratio"
              className="stat">
              Hlutfall
              {showInfo.ratio &&
                this.renderInfo(
                  'Fjöldi setninga sem hlutfall af fjölda nemenda í skóla',
                  false
                )}
            </div>
            <div
              onMouseEnter={e => this.showInfo(e)}
              onMouseLeave={this.hideInfo}
              className="stat"
              id="count"
              onClick={(e: any) => this.setSortBy(e.target.id)}>
              Setningar
              {showInfo.count &&
                this.renderInfo(
                  'Fjöldi setninga sem keppendur í skóla hafa lesið inn',
                  false
                )}
            </div>
          </div>
          {hiddenLeaderboard && (
            <div className="countdown-container">
              <div className="countdown">
                <h2>Stigatafla hulin</h2>
                <p>Grunnskólakeppninni er lokið. </p>
                <p>
                  Það er alltaf hægt að lesa inn í Samróm með því að smella{' '}
                  <LocaleLink to={URLS.SPEAK}>
                    <b>hér.</b>
                  </LocaleLink>
                </p>
                <p>
                  Stigataflan verður hulin þar til úrslit verða tilkynnt í næstu
                  viku.
                </p>
              </div>
            </div>
          )}
          {stats ? this.renderStats(stats) : <Spinner />}
        </div>
      </>
    );
  }
}
