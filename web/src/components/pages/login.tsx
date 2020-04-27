import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import URLS from '../../urls';
import { Notifications } from '../../stores/notifications';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';

interface NotificationProps {
  addNotification: typeof Notifications.actions.addPill;
}

export const LoginFailure = connect<void, NotificationProps>(
  null,
  {
    addNotification: Notifications.actions.addPill,
  }
)(
  withRouter(
    class extends React.Component<
      NotificationProps & RouteComponentProps<any>
    > {
      componentDidMount() {
        const { addNotification, history } = this.props;
        addNotification('Innskráning mistókst!');
        history.replace(URLS.ROOT);
      }

      render(): React.ReactNode {
        return null;
      }
    }
  )
);

interface PropsFromState {
  user: User.State;
}

interface PropsFromDispatch {
  saveNewAccount: typeof User.actions.saveNewAccount;
  refreshUser: typeof User.actions.refresh;
}

interface Props
  extends PropsFromDispatch,
    PropsFromState,
    RouteComponentProps<any> {}

export const LoginSuccess = withRouter(
  connect<PropsFromState, any>(
    ({ user }: StateTree) => ({ user }),
    {
      saveNewAccount: User.actions.saveNewAccount,
      refreshUser: typeof User.actions.refresh,
    }
  )(
    class extends React.Component<Props> {
      constructor(props: Props) {
        super(props);
      }
      componentDidMount = async () => {
        const { saveNewAccount, refreshUser, user } = this.props;
        await saveNewAccount(user.userClients[0]);
        refreshUser();
        this.redirect(this.props);
      };

      componentWillReceiveProps(props: Props) {
        this.redirect(props);
      }

      redirect({ history, user }: Props) {
        const { account, isFetchingAccount } = user;
        if (isFetchingAccount) return;
        history.replace(URLS.ADMIN);
      }

      render(): React.ReactNode {
        return null;
      }
    }
  )
);
