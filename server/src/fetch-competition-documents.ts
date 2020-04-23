import * as request from 'request-promise-native';

const CACHE_AGE = 1000 * 60 * 30;
const initialCache = {
  fetchedAt: -1,
  institutions: {
    institutions: {},
  },
};
let cache: {
  fetchedAt: number;
  institutions: Institutions;
} = initialCache;

interface Institutions {
  institutions: {
    [index: number]: {
      name: string;
      code: string;
      enrollment: number;
      divisions: {
        [index: number]: {
          name: string;
          code: string;
        };
      };
    };
  };
}

export default async function fetchInstitutions(): Promise<Institutions> {
  let { fetchedAt, institutions } = cache || ({} as any);

  if (institutions && fetchedAt > Date.now() - CACHE_AGE) {
    return institutions;
  }

  const [status, text] = await request({
    uri: `https://raw.githubusercontent.com/aime-island/competition-docs/master/institutions.json`,
    resolveWithFullResponse: true,
  })
    .then((response: any) => [response.statusCode, response.body])
    .catch(response => [response.statusCode, null]);

  if (status >= 400 && status < 500) {
    return await fetchInstitutions();
  } else if (status < 300) {
    institutions = text;
  }

  cache = { fetchedAt: Date.now(), institutions };

  return institutions;
}
