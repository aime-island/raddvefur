import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import URLS from '../../../urls';
import API from '../../../services/api';
import StateTree from '../../../stores/tree';
import { localeConnector, LocalePropsFromState } from '../../locale-helpers';
import Leaderboard from './leaderboard';
import {
  Institutions,
  Institution,
  InstitutionStat,
} from '../../../stores/competition';
import { Spinner } from '../../ui/ui';
import { LocaleLink, useLocale, LocaleNavLink } from '../../locale-helpers';
import { PlayOutlineIcon, MicIcon } from '../../ui/icons';

import { SpeakForSamromur } from '../../shared/links';

import './competition.css';

interface PropsFromState {
  api: API;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

type State = {
  stats: InstitutionStat[];
  institutions: Institution[];
};

class Competition extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      stats: [],
      institutions: [],
    };
  }

  componentDidMount = async () => {
    const institutions: Institutions = await this.props.api.fetchInstitutions();
    this.setState({
      institutions: institutions.institutions,
    });
    const stats: InstitutionStat[] = await this.props.api.getLeaderboard();
    this.setState({
      stats: stats,
    });
    console.log(stats);
  };

  render() {
    const { institutions, stats } = this.state;
    return (
      <div className="competition-container">
        <div className="text">
          <div className="line" />
          <Localized id="competition-heading">
            <h1 />
          </Localized>
          <div id="competition-info">
            <Localized id="competition-text-one">
              <p />
            </Localized>
            <Localized
              id="competition-text-two"
              speakLink={<SpeakForSamromur />}>
              <p />
            </Localized>
            <Localized id="competition-text-three">
              <p />
            </Localized>
          </div>
          <div className="line" />
          <div className="participate-container">
            <Localized id="participate-here">
              <h2 />
            </Localized>
            <LocaleLink to={URLS.SPEAK}>
              <MicIcon />
            </LocaleLink>
          </div>
        </div>
        <div className="leaderboard">
          {stats.length != 0 && institutions.length != 0 ? (
            <Leaderboard institutions={institutions} stats={stats} />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default localeConnector(
  withLocalization(connect<PropsFromState>(mapStateToProps)(Competition))
);
