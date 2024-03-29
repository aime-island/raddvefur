const PROFILE_ROOT = '/profile';
export default Object.freeze({
  ROOT: '',

  RECORD: '/record', // old, here for redirect purposes
  SPEAK: '/tala',
  LISTEN: '/hlusta',

  PROFILE: PROFILE_ROOT,
  PROFILE_INFO: PROFILE_ROOT + '/info',
  PROFILE_AVATAR: PROFILE_ROOT + '/avatar',
  PROFILE_SETTINGS: PROFILE_ROOT + '/settings',
  PROFILE_DELETE: PROFILE_ROOT + '/delete',

  DASHBOARD: '/dashboard', // old, here for redirect purposes
  STATS: '/stats',
  PROFILE_GOALS: PROFILE_ROOT + '/goals', // old, here for redirect purposes
  GOALS: '/goals',
  AWARDS: '/awards',

  DATA: '/data', // old, here for redirect purposes
  DATASETS: '/gagnasafn',

  COMPETITION_TOTAL: '/keppni',
  COMPETITION_A: '/keppni/yqnt',
  COMPETITION_B: '/keppni/n5uo',

  PRIVACY: '/personuverndaryfirlysing',
  TERMS: '/skilmalar',
  COOKIES: '/vafrakokustefna',
  NOTFOUND: '/not-found',
  LANGUAGES: '/takk',
  THANKYOU: '/takk',
  ABOUT: '/um',
  MAIL: 'mailto:samromur@ru.is',
});
