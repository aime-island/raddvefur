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

interface Props {
  institutions: Institution[];
  stats: InstitutionStat[];
  api: API;
}

interface State {
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
    let currentUrl = window.location.pathname;
    let filteredStats = [];

    for (const items in stats) {
      if (
        currentUrl === URLS.COMPETITION_A &&
        this.getInstitutionEnrollment(stats[items].institution) >= 500
      ) {
        filteredStats.push(stats[0]);
      } else if (
        currentUrl === URLS.COMPETITION_B &&
        this.getInstitutionEnrollment(stats[items].institution) < 500
      ) {
        filteredStats.push(stats[0]);
      }
    }

    let i = 0;
    const newstats = filteredStats.map((stat: InstitutionStat) => {
      i += 1;
      return {
        ...stat,
        rank: i,
        ratio: stat.count / this.getInstitutionEnrollment(stat.institution),
      };
    });

    this.setState({
      stats: newstats,
    });
  };

  componentDidMount = () => {
    const { stats } = this.props;
    if (stats.length != 0) {
      this.addStatsToState(stats);
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
      selectedInstitution,
      selectedInstitutionStats,
      stats,
      showInfo,
      showInstitutionModal,
    } = this.state;

    const { api } = this.props;
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
          {stats ? this.renderStats(stats) : <Spinner />}
        </div>
      </>
    );
  }
}
