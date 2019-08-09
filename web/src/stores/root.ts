import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import API from '../services/api';
import { trackProfile } from '../services/tracker';
import { hash } from '../utility';
import { Flags } from './flags';
import { Clips } from './clips';
import { Locale } from './locale';
import { Notifications } from './notifications';
import { RequestedLanguages } from './requested-languages';
import { Sentences } from './sentences';
import StateTree from './tree';
import { Uploads } from './uploads';
import { User } from './user';
import { Cookies } from './cookies';

export const USER_KEY = 'user';
export const USER_COOKIES_AGREED = 'cookiesAgreed';

let preloadedState = null;
let fcookies =
  JSON.parse(localStorage.getItem(USER_COOKIES_AGREED)) || undefined;

preloadedState = {
  user: undefined,
  cookies: undefined,
};

if (fcookies) {
  try {
    preloadedState.cookies = fcookies;
  } catch (e) {
    console.error('failed parsing storage', e);
    localStorage.removeItem(USER_COOKIES_AGREED);
  }

  if (fcookies.ud) {
    try {
      preloadedState.user =
        JSON.parse(localStorage.getItem(USER_KEY)) || undefined;
    } catch (e) {
      console.error('failed parsing storage', e);
      localStorage.removeItem(USER_KEY);
    }
  }
}

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  function root(
    {
      sentences,
      user,
      clips,
      flags,
      requestedLanguages,
      locale,
      notifications,
      uploads,
      cookies,
    }: StateTree = {
      api: undefined,
      clips: undefined,
      flags: undefined,
      locale: undefined,
      notifications: undefined,
      requestedLanguages: undefined,
      sentences: undefined,
      uploads: undefined,
      user: undefined,
      cookies: undefined,
    },
    action:
      | Clips.Action
      | Flags.Action
      | Locale.Action
      | RequestedLanguages.Action
      | Sentences.Action
      | Uploads.Action
      | User.Action
      | Cookies.Action
  ): StateTree {
    const newState = {
      clips: Clips.reducer(locale, clips, action as Clips.Action),
      flags: Flags.reducer(flags, action as Flags.Action),
      locale: Locale.reducer(locale, action as Locale.Action),
      requestedLanguages: RequestedLanguages.reducer(
        requestedLanguages,
        action as RequestedLanguages.Action
      ),
      sentences: Sentences.reducer(
        locale,
        sentences,
        action as Sentences.Action
      ),
      notifications: Notifications.reducer(notifications, action as any),
      uploads: Uploads.reducer(uploads, action as Uploads.Action),
      user: User.reducer(user, action as User.Action),
      cookies: Cookies.reducer(cookies, action as Cookies.Action),
    };

    return { api: new API(newState.locale, newState.user), ...newState };
  },
  preloadedState,
  composeEnhancers(applyMiddleware(thunk))
);

store.dispatch(User.actions.update({}) as any);
store.dispatch(User.actions.refresh() as any);

const flags = document.querySelector('#flags');

try {
  flags && store.dispatch(Flags.actions.set(JSON.parse(flags.textContent)));
  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of Array.from(mutation.addedNodes)) {
        if ((node as any).id === 'flags') {
          store.dispatch(Flags.actions.set(JSON.parse(node.textContent)));
        }
      }
    }
  });
  observer.observe(document.body, { childList: true });
} catch (e) {
  console.error('error settings flags', e);
}

const fieldTrackers: any = {
  email: trackProfile.bind(null, 'give-email'),
  username: trackProfile.bind(null, 'give-username'),
  accent: trackProfile.bind(null, 'give-accent'),
  age: trackProfile.bind(null, 'give-age'),
  gender: trackProfile.bind(null, 'give-gender'),
};

declare const ga: any;

let prevUser: User.State = null;
store.subscribe(async () => {
  const { locale, user, cookies } = store.getState();

  if (cookies.set) {
    localStorage[USER_COOKIES_AGREED] = JSON.stringify(cookies);
  }

  if (cookies.ga && ga && (!prevUser || !prevUser.account) && user.account) {
    ga('set', 'userId', await hash(user.account.client_id));
    ga('send', 'pageview');
  }

  for (const field of Object.keys(fieldTrackers)) {
    const typedField = field as keyof User.State;
    if (prevUser && user[typedField] !== prevUser[typedField]) {
      fieldTrackers[typedField](locale);
    }
  }

  prevUser = user;

  if (cookies.ud) {
    localStorage[USER_KEY] = JSON.stringify({
      ...user,
      account: null,
      isFetchingAccount: true,
    });
  }
});

//Only check for storage events in non-IE browsers, as it misfires in IE
if (!(document as any).documentMode && store.getState().cookies.ud) {
  window.addEventListener('storage', (storage: StorageEvent) => {
    if (storage.key === USER_KEY) {
      store.dispatch(User.actions.update(JSON.parse(storage.newValue)) as any);
    }
  });
}

export default store;
