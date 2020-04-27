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
import { User } from '../../../stores/user';
import { LinkButton } from '../../ui/ui';

import './admin.css';

interface PropsFromState {
  api: API;
  user: User.State;
}

type Props = LocalePropsFromState & LocalizationProps & PropsFromState;

type State = {
  hasAccount: boolean;
};

class AdminPage extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      hasAccount: false,
    };
  }

  componentDidMount = () => {
    this.checkAccount();
  };

  checkAccount = () => {
    const { user } = this.props;
    if (user.account) {
      this.setState({
        hasAccount: true,
      });
    }
  };

  login = () => {
    window.location.href = '/login';
  };

  render() {
    const { hasAccount } = this.state;
    return (
      <div className="admin-container">
        {hasAccount ? (
          <div>Þú ert innskráður.</div>
        ) : (
          <div className="login-container">
            <Localized id="admin-login">
              <LinkButton rounded href="/login" onClick={this.login} />
            </Localized>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ api, user }: StateTree) => ({
  api,
  user,
});

export default localeConnector(
  withLocalization(connect<PropsFromState>(mapStateToProps)(AdminPage))
);
