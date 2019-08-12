const { LocalizationProvider } = require('fluent-react/compat');
import * as React from 'react';
import { Suspense } from 'react';
import { connect, Provider } from 'react-redux';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { UserClient } from 'common/user-clients';
import store from '../stores/root';
import URLS from '../urls';
import {
  isFirefoxFocus,
  isMobileWebkit,
  isNativeIOS,
  isProduction,
  isStaging,
  replacePathLocale,
} from '../utility';
import {
  createBundleGenerator,
  DEFAULT_LOCALE,
  LOCALES,
  negotiateLocales,
} from '../services/localization';
import API from '../services/api';
import { Locale } from '../stores/locale';
import { Notifications } from '../stores/notifications';
import StateTree from '../stores/tree';
import { Uploads } from '../stores/uploads';
import { User } from '../stores/user';
import Layout from './layout/layout';
import NotificationBanner from './notification-banner/notification-banner';
import NotificationPill from './notification-pill/notification-pill';
import { LoginFailure, LoginSuccess } from './pages/login';
import { Spinner, Button, ToggleIs } from './ui/ui';
import {
  isContributable,
  localeConnector,
  LocalePropsFromState,
  LocaleLink,
} from './locale-helpers';
import Modal, { ModalButtons } from './modal/modal';
import { Flags } from '../stores/flags';
import { Cookies } from '../stores/cookies';
import { InfoIcon, CogIcon } from './ui/icons';
const rtlLocales = require('../../../locales/rtl.json');
const ListenPage = React.lazy(() =>
  import('./pages/contribution/listen/listen')
);
const SpeakPage = React.lazy(() => import('./pages/contribution/speak/speak'));

interface PropsFromState {
  api: API;
  user: User.State;
  account: UserClient;
  notifications: Notifications.State;
  uploads: Uploads.State;
  messageOverwrites: Flags.MessageOverwrites;
  cookies: Cookies.State;
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addBanner;
  removeUpload: typeof Uploads.actions.remove;
  setLocale: typeof Locale.actions.set;
  refreshUser: typeof User.actions.refresh;
  updateUser: typeof User.actions.update;
  updateCookies: typeof Cookies.actions.update;
}

interface LocalizedPagesProps
  extends PropsFromState,
    PropsFromDispatch,
    LocalePropsFromState,
    RouteComponentProps<any> {
  userLocales: string[];
}

interface LocalizedPagesState {
  hasScrolled: boolean;
  bundleGenerator: any;
  uploadPercentage?: number;
  showCookiesModal: boolean;
  showCookiesPreference: boolean;
  statCo: boolean;
  prefCo: boolean;
}

let LocalizedPage: any = class extends React.Component<
  LocalizedPagesProps,
  LocalizedPagesState
> {
  seenAwardIds: number[] = [];
  state: LocalizedPagesState = {
    hasScrolled: false,
    bundleGenerator: null,
    uploadPercentage: null,
    showCookiesModal: true,
    showCookiesPreference: false,
    statCo: false,
    prefCo: true,
  };

  isUploading = false;

  async componentDidMount() {
    await this.prepareBundleGenerator(this.props);
    window.addEventListener('scroll', this.handleScroll);
    setTimeout(() => this.setState({ hasScrolled: true }), 5000);
    this.props.refreshUser();
  }

  async componentWillReceiveProps(nextProps: LocalizedPagesProps) {
    const { account, addNotification, api, uploads, userLocales } = nextProps;
    const { cookies } = this.props;

    if (cookies.set) {
      this.setState({ showCookiesModal: false });
    }

    this.runUploads(uploads).catch(e => console.error(e));

    window.onbeforeunload =
      uploads.length > 0
        ? e => {
            e.preventDefault();
            e.returnValue =
              'Ef þú ferð af síðunni núna þá hættir þú við óklárað upphal. Ertu viss?';
          }
        : undefined;

    if (userLocales.find((locale, i) => locale !== this.props.userLocales[i])) {
      await this.prepareBundleGenerator(nextProps);
    }

    const award =
      account && account.awards
        ? account.awards.find(
            a => !a.notification_seen_at && !this.seenAwardIds.includes(a.id)
          )
        : null;

    if (award) {
      this.seenAwardIds.push(...account.awards.map(a => a.id));
      addNotification(
        `Success, ${award.amount} Clip ${
          award.days_interval == 1 ? 'daily' : 'weekly'
        } goal achieved!`,
        {
          children: 'Check out your award!',
          to: URLS.AWARDS,
        }
      );
      await api.seenAwards('notification');
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  async runUploads(uploads: Uploads.State) {
    if (this.isUploading) return;
    this.isUploading = true;
    this.setState({ uploadPercentage: 0 });
    for (let i = 0; i < uploads.length; i++) {
      this.setState({ uploadPercentage: (i + 1) / (uploads.length + 1) });
      const upload = uploads[i];
      try {
        await upload();
      } catch (e) {
        console.error('upload error', e);
      }
      this.props.removeUpload(upload);
    }
    this.setState({ uploadPercentage: null });
    this.isUploading = false;

    if (this.props.uploads.length > 0) {
      await this.runUploads(this.props.uploads);
    }
  }

  async prepareBundleGenerator({
    api,
    history,
    userLocales,
  }: LocalizedPagesProps) {
    const [mainLocale] = userLocales;
    const pathname = history.location.pathname;

    this.props.setLocale('is');

    const { documentElement } = document;
    documentElement.setAttribute('lang', mainLocale);
    documentElement.setAttribute(
      'dir',
      rtlLocales.includes(mainLocale) ? 'rtl' : 'ltr'
    );

    this.setState({
      bundleGenerator: await createBundleGenerator(
        api,
        userLocales,
        this.props.messageOverwrites
      ),
    });
  }

  handleScroll = () => {
    if (!this.state.hasScrolled) {
      this.setState({ hasScrolled: true });
    }
  };

  setCookiePreference = () => {
    const { updateCookies } = this.props;
    updateCookies({ set: true, ud: this.state.prefCo, ga: this.state.statCo });
    this.setState({ showCookiesModal: false });
  };

  setShowCookiesModal = () => {
    this.setState({ showCookiesModal: !this.state.showCookiesModal });
  };

  isDocumentPage = () => {
    const docs = [
      `/is${URLS.TERMS}`,
      `/is${URLS.PRIVACY}`,
      `/is${URLS.COOKIES}`,
    ];
    return docs.includes(window.location.pathname);
  };

  render() {
    const { locale, notifications, toLocaleRoute } = this.props;
    const {
      bundleGenerator,
      uploadPercentage,
      showCookiesModal,
      statCo,
      prefCo,
    } = this.state;

    if (!bundleGenerator) return null;

    return (
      <div>
        <div
          className="upload-progress"
          style={
            uploadPercentage === null
              ? {
                  opacity: 0,
                  width: '100%',
                  background: '#59cbb7',
                  animationPlayState: 'paused',
                }
              : {
                  opacity: 1,
                  width: uploadPercentage * 100 + '%',
                  animationPlayState: 'running',
                }
          }
        />
        {showCookiesModal && !this.isDocumentPage() && (
          <Modal innerClassName="cookie-modal">
            <div>
              <div className="modal-title">
                Þessi vefsíða notar vafrakökur (e. cookies) og vefgeymslu vafra
                (e. local storage) til að bæta upplifun þína á vefsíðunni.{' '}
                <a href={URLS.COOKIES}>Sjá nánar</a>
              </div>
            </div>
            <div className="toggle-with-info">
              <h3 className="cookie-title">Frammistaða og virkni</h3>
              <div className="toggle-container">
                {/* <div className="cookie-name">
                  Nafn: <strong>user</strong>
                </div> */}
                <ToggleIs
                  onText="Leyfa"
                  offText="Ekki leyfa"
                  defaultChecked={prefCo}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ prefCo: event.target.checked });
                  }}
                />
              </div>
              <div className="info">
                <InfoIcon />
                <div className="cookie-text">
                  Notkun vefgeymslu vafrans til að halda um upplýsingar sem bæta
                  afköst síðunar og notendaupplifun. Þetta eru upplýsingar sem
                  notandi hefur skráð inn, samþykki, einstakt notanda númer,
                  fjöldi raddsýna sem notandi hefur gefið og fjöldi raddsýna sem
                  notandi hefur hlustað á.
                </div>
              </div>
            </div>
            <div className="toggle-with-info">
              <h3 className="cookie-title">Tölfræði um notkun</h3>
              <div className="toggle-container">
                {/* <div className="cookie-name">
                  Nafn: <strong>ga</strong>
                </div> */}
                <ToggleIs
                  onText="Leyfa"
                  offText="Ekki leyfa"
                  defaultChecked={statCo}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    this.setState({ statCo: event.target.checked });
                  }}
                />
              </div>
              <div className="info">
                <InfoIcon />
                <div className="cookie-text">
                  Notkun vafrakaka til að mæla notkun á ýmsum undirsíðum innan
                  vefsíðunnar, það hjálpar okkur að meta hvað þarf að bæta, til
                  þess notum við kökur fyrir Google Analyctics. Með því getum
                  við séð notkunarmynstur á síðunni yfir heildina í stað þess að
                  sjá notkun einstaka notanda. Við notum upplýsingarnar til að
                  greina umferð á vefsíðunni en ekki til að skoða
                  persónugreinanlegar upplýsingar.
                </div>
              </div>
            </div>
            <ModalButtons>
              <Button
                rounded
                className="btn-grn"
                onClick={() => this.setCookiePreference()}>
                Áfram
              </Button>
            </ModalButtons>
          </Modal>
        )}
        {!showCookiesModal && !this.isDocumentPage() && (
          <div
            className="cookie-corner"
            onClick={() => this.setShowCookiesModal()}>
            <CogIcon />
          </div>
        )}
        <LocalizationProvider bundles={bundleGenerator}>
          <div>
            <div className="notifications">
              {notifications
                .slice()
                .reverse()
                .map(notification =>
                  notification.kind == 'pill' ? (
                    <NotificationPill
                      key={notification.id}
                      {...{ notification }}
                    />
                  ) : (
                    <NotificationBanner
                      key={notification.id}
                      {...{ notification }}
                    />
                  )
                )}
            </div>

            <Switch>
              {[
                { route: URLS.SPEAK, Component: SpeakPage },
                { route: URLS.LISTEN, Component: ListenPage },
              ].map(({ route, Component }: any) => (
                <Route
                  key={route}
                  exact
                  path={toLocaleRoute(route)}
                  render={props =>
                    isContributable(locale) ? (
                      <Component {...props} />
                    ) : (
                      <Redirect to={toLocaleRoute(URLS.ROOT)} />
                    )
                  }
                />
              ))}
              <Layout />
            </Switch>
          </div>
        </LocalizationProvider>
      </div>
    );
  }
};

LocalizedPage = withRouter(
  localeConnector(
    connect<PropsFromState, PropsFromDispatch>(
      ({ api, flags, notifications, uploads, user, cookies }: StateTree) => ({
        account: user.account,
        api,
        user,
        messageOverwrites: flags.messageOverwrites,
        notifications,
        uploads,
        cookies,
      }),
      {
        addNotification: Notifications.actions.addBanner,
        removeUpload: Uploads.actions.remove,
        setLocale: Locale.actions.set,
        refreshUser: User.actions.refresh,
        updateUser: User.actions.update,
        updateCookies: Cookies.actions.update,
      }
    )(LocalizedPage)
  )
);

const history = createBrowserHistory();

class App extends React.Component {
  main: HTMLElement;
  userLocales: string[];

  state: { error: Error; Sentry: any } = { error: null, Sentry: null };

  /**
   * App will handle routing to page controllers.
   */
  constructor(props: any, context: any) {
    super(props, context);

    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    if (isFirefoxFocus()) {
      document.body.classList.add('focus');
    }

    if (isMobileWebkit()) {
      document.body.classList.add('mobile-safari');
    }

    this.userLocales = negotiateLocales(navigator.languages);
  }

  async componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ error });

    if (!isProduction() && !isStaging()) {
      return;
    }
    const Sentry = await import('@sentry/browser');
    Sentry.init({
      dsn: 'https://e0ca8e37ef77492eb3ff46caeca385e5@sentry.io/1352219',
    });
    Sentry.withScope(scope => {
      Object.keys(errorInfo).forEach(key => {
        scope.setExtra(key, errorInfo[key]);
      });
      Sentry.captureException(error);
    });
    this.setState({ Sentry });
  }

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    document.body.classList.add('ios');
  }

  render() {
    const { error, Sentry } = this.state;
    if (error) {
      return (
        <div>
          An error occurred. Sorry!
          <br />
          <button onClick={() => Sentry.showReportDialog()} disabled={!Sentry}>
            Report feedback
          </button>
          <br />
          <button onClick={() => location.reload()}>Reload</button>
        </div>
      );
    }

    return (
      <Suspense fallback={<Spinner />}>
        <Provider store={store}>
          <Router history={history}>
            <Switch>
              <Route exact path="/login-failure" component={LoginFailure} />
              <Route exact path="/login-success" component={LoginSuccess} />
              {Object.values(URLS).map(url => (
                <Route
                  key={url}
                  exact
                  path={url || '/'}
                  render={() => (
                    <Redirect
                      to={'/' + this.userLocales[0] + url + location.search}
                    />
                  )}
                />
              ))}
              <Route
                path="/:locale"
                render={({
                  match: {
                    params: { locale },
                  },
                }) => (
                  <LocalizedPage userLocales={[locale, ...this.userLocales]} />
                )}
              />
            </Switch>
          </Router>
        </Provider>
      </Suspense>
    );
  }
}

export default App;
