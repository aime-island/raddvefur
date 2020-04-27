import * as request from 'request-promise-native';

export interface Sentence {
  origin: string;
  text: string;
}

export interface Sentences {
  script: Sentence[];
  version: number;
}

export default async function fetchSentences(age: string): Promise<Sentences> {
  return new Promise(async resolve => {
    let type;
    switch (age) {
      case 'kids':
        type = 'kids_aged_10_and_under';
        break;
      case 'teens':
        type = 'kids_aged_11-15';
        break;
      case 'adults':
        type = 'scripts_aged_15_above';
        break;
      default:
        type = 'scripts_aged_15_above';
        break;
    }

    const [status, text] = await request({
      uri: `https://raw.githubusercontent.com/aime-island/scripts_for_samromur/master/json/${type}.json`,
      resolveWithFullResponse: true,
    })
      .then((response: any) => [response.statusCode, response.body])
      .catch(response => [response.statusCode, null]);
    if (status >= 400 && status < 500) {
      return fetchSentences(age);
    } else if (status < 300) {
      resolve(JSON.parse(text));
    }
  });
}
