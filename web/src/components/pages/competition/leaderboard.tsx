import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Institution, InstitutionStat } from '../../../stores/competition';
import { SortIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';

import './leaderboard.css';

interface Props {
  institutions: Institution[];
  stats: InstitutionStat[];
}

interface State {
  stats: InstitutionStat[];
  sortByIdentifier: string;
  sortBySequence: boolean;
}

export default class Leaderboard extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      stats: [],
      sortByIdentifier: 'count',
      sortBySequence: true,
    };
  }

  componentWillReceiveProps = () => {
    const { stats } = this.props;
    this.setState({
      stats: [].concat(stats),
    });
  };

  sort = (identifier: string, sequence: boolean) => {
    const { stats } = this.state;
    let newStats;
    if (identifier == 'count' || identifier == 'users') {
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

  render() {
    const { stats, sortByIdentifier } = this.state;
    const { institutions } = this.props;
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header leaderboard-item">
          <span>#</span>
          <span>Nafn</span>
          <div
            className="stat"
            id="users"
            onClick={(e: any) => this.setSortBy(e.target.id)}>
            Þáttakendur {sortByIdentifier == 'users' && <SortIcon />}
          </div>
          <div
            className="stat"
            id="count"
            onClick={(e: any) => this.setSortBy(e.target.id)}>
            Setningar {sortByIdentifier == 'count' && <SortIcon />}
          </div>
          <span className="proportion">Hlutfall</span>
        </div>
        {stats ? renderStats(stats, institutions) : <Spinner />}
      </div>
    );
  }
}

const renderStats = (stats: InstitutionStat[], institutions: Institution[]) => {
  const getInstitutionName = (code: string): string => {
    const institution = institutions.find(
      (item: Institution) => item.code == code
    );
    if (institution) {
      return institution.name;
    } else {
      return 'Stofnun';
    }
  };

  return stats.map((stat: InstitutionStat) => {
    return (
      <div key={stat.institution} className="leaderboard-item">
        <span>{stat.rank}</span>
        <span>{getInstitutionName(stat.institution)}</span>
        <span className="stat">{stat.users}</span>
        <span className="stat stat-main">{stat.count}</span>
        <span className="stat stat-prop">{stat.count}</span>
      </div>
    );
  }); //Ekki rétt gögn í neðsta spam-inu
};
