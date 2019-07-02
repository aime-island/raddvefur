import * as React from 'react';
import URLS from '../../../urls';
import { StyledLink } from '../../ui/ui';
import { LocaleLink } from '../../locale-helpers';
import { stringContains } from '../../../utility';
import { LocalizationProps } from 'fluent-react/compat';
import { BENEFITS, WHATS_PUBLIC } from '../../../constants';

/**
 * Hér má breyta innihaldi síðunnar FAQ, taka út spurningar og þannig
 */

const memoize = require('lodash.memoize');

export const SECTIONS: any = {
  whatIsCV: 'what-is-common-voice',
  usingCV: 'using-common-voice',
  glossary: 'glossary',
};

const SECTION_NAMES: any = {
  [SECTIONS.whatIsCV]: 'faq-what-cv-q',
  [SECTIONS.usingCV]: 'faq-using-cv',
  [SECTIONS.glossary]: 'glossary',
};

const SECTION_CONTENTS: any = {
  [SECTIONS.whatIsCV]: [
    'faq-what-cv',
    'faq-why-important',
    [
      'faq-why-mission-q',
      'faq-why-mission-a',
      {
        mozillaLink: <StyledLink href="https://voice.mozilla.org/en" blank />,
      },
    ],
    'faq-what-cv-and-deepspeech',
    'faq-is-goal-assistant',
    /*[
      'faq-when-release-q',
      'faq-when-release-a',
    ],*/
  ],
  [SECTIONS.usingCV]: [
    [
      'faq-how-get-q',
      'faq-how-get-a' /*,
      {
        //Taka út
        licenseLink: (
          <StyledLink
            href="https://creativecommons.org/publicdomain/zero/1.0/"
            blank
          />
        ),
        datasetLink: <LocaleLink to={URLS.DATASETS} />,
      },*/,
    ],
    'faq-do-want-native',
    [
      'faq-why-different-speakers-q',
      'faq-why-different-speakers-a',
      {
        articleLink: <StyledLink href="https://econ.st/2AVxVG3" blank />,
      },
    ],
    [
      'faq-why-my-lang-q',
      'faq-why-my-lang-new-a',
      {
        articleLink: <StyledLink href="https://econ.st/2AVxVG3" blank />,
      },
    ],
    'faq-what-quality',
    'faq-why-10k-hours',
    //'faq-why-not-ask-read',
    'faq-how-calc-hours',
    [
      'faq-where-src-from-2-q',
      'faq-where-src-from-2-a' /*,
      {
        italic: <i />,
        githubLink: (
          <StyledLink
            href="https://github.com/mozilla/voice-web/tree/master/server/data"
            blank
          />
        ),
      },*/,
    ],
    ['faq-why-account-q', 'faq-why-account-a'],
    /*['faq-is-account-public-q', WHATS_PUBLIC],*/
    'faq-how-privacy',
    'faq-what-determine-identity',
  ],
  [SECTIONS.glossary]: [
    ['localization', 'localization-explanation'],
    ['sentence-collection', 'sentence-collection-explanation'],
    ['hours-recorded', 'hours-recorded-explanation'],
    ['hours-validated', 'hours-validated-explanation'],
    ['sst', 'sst-explanation'],
    ['de-identified', 'de-identified-explanation'],
  ],
};

export type FaqSection = {
  key: string;
  label: string;
  content: any[];
};

interface FaqSearchSelectorProps {
  searchString: string;
}

export const faqSearchSelector = memoize(
  ({
    getString,
    searchString,
  }: LocalizationProps & FaqSearchSelectorProps): FaqSection[] => {
    const search = searchString.trim().toUpperCase();

    return Object.values(SECTIONS)
      .map((section: string) => {
        const content: any[] = (SECTION_CONTENTS[section] || []) as any[];

        return {
          key: section,
          label: SECTION_NAMES[section] || SECTIONS[section],
          content: content
            .map(c => (Array.isArray(c) ? c : [c + '-q', c + '-a', {}]))
            .map(([question, answers, ...rest]) => {
              const params = rest.length === 0 ? [{}] : rest;

              return [
                question,
                Array.isArray(answers) ? answers : [answers],
                ...params,
              ];
            })
            .filter(([question, answers, props]) => {
              if (!search) {
                return true;
              }

              return (
                stringContains(getString(question), search) ||
                answers.some((answer: string) =>
                  stringContains(getString(answer, props), search)
                )
              );
            }),
        };
      })
      .filter((section: FaqSection) => section.content.length !== 0);
  },
  ({ searchString }: FaqSearchSelectorProps) => searchString.toUpperCase()
);
