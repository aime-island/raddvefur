import { UserClient } from 'common/user-clients';

const SEARCH_REG_EXP = new RegExp('</?[^>]+(>|$)', 'g');

/**
 * Generate RFC4122 compliant globally unique identifier.
 */
export function generateGUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Count the syllables in a string. Completely stolen from:
 * https://codegolf.stackexchange.com/
 *   questions/47322/how-to-count-the-syllables-in-a-word
 */
let re = /[aiouy]+e*|e(?!d$|ly).|[td]ed|le$/gi;
export function countSyllables(text: string): number {
  let matches = text.match(re);
  return matches.length;
}

/**
 * Test if we are running in the iOS native app wrapper.
 */
export function isNativeIOS(): boolean {
  return (
    window['webkit'] &&
    webkit.messageHandlers &&
    webkit.messageHandlers.scriptHandler
  );
}

export function isSafariIOS(): boolean {
  return isMobileWebkit();
}

export function isFirefoxFocus(): boolean {
  return navigator.userAgent.indexOf('Focus') !== -1;
}

export function getUserAgent(): string {
  return navigator.userAgent;
}

export function isFacebook(): boolean {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return (
    ua.indexOf('FBAN') > -1 ||
    ua.indexOf('FBAV') > -1 ||
    ua.indexOf('FB_IAB') > -1
  );
}

export function isFacebookIOS(): boolean {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('FBIOS') > -1;
}

export function isInstagram(): boolean {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('Instagram') > -1;
}

export function isTwitter(): boolean {
  var ua = navigator.userAgent || navigator.vendor || window.opera;
  return ua.indexOf('Twitter') > -1;
}

export function isSocial(): boolean {
  return isFacebook() || isInstagram();
}

/**
 * Test whether this is a browser on iOS.
 */
export function isIOS(): boolean {
  return /(iPod|iPhone|iPad)/i.test(window.navigator.userAgent);
}

export function isWebkit(): boolean {
  return /AppleWebKit/i.test(window.navigator.userAgent);
}

/**
 * Check whether the browser is Safari (either desktop or mobile).
 */
export function isSafari(): boolean {
  const userAgent = window.navigator.userAgent;
  /* Just checking isSafari isn't enough, because multiple browsers on iOS
   * identify as Safari. The difference is that they have a different version
   * string in the user agent. E.g. Safari has Version/<version>, Chrome has
   * CriOS/<version>, Firefox has FxiOS/<version>.
   */
  const pretendsSafari = /Safari/i.test(userAgent);
  const isSafari = /Version/i.test(userAgent);
  return isWebkit() && pretendsSafari && isSafari;
}

/**
 * Check whether the browser is mobile Safari (i.e. on iOS).
 *
 * The logic is collected from answers to this SO question: https://stackoverflow.com/q/3007480
 */
export function isMobileWebkit(): boolean {
  return (
    isIOS() &&
    isWebkit() &&
    !/(Chrome|CriOS|OPiOS)/.test(window.navigator.userAgent)
  );
}

export function isMobileResolution(): boolean {
  return window.matchMedia('(max-width: 768px)').matches;
}

export function isProduction(): boolean {
  return window.location.origin === 'https://almannaromur.is';
}

export function isStaging(): boolean {
  return window.location.origin === 'https://staging-almannaromur.is';
}

export function getItunesURL(): string {
  return 'https://itunes.apple.com/us/app/project-common-voice-by-mozilla/id1240588326';
}

/**
 * Replaces the locale part of a given path
 */
export function replacePathLocale(pathname: string, locale: string) {
  const pathParts = pathname.split('/');
  pathParts[1] = locale;
  return pathParts.join('/');
}

export function getManageSubscriptionURL(account: UserClient) {
  const firstLanguage = account.locales[0];
  return `https://www.mozilla.org/${
    firstLanguage ? firstLanguage.locale + '/' : ''
  }newsletter/existing/${account.basket_token}`;
}

export async function hash(text: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', data);

  return [...new Uint8Array(digest)]
    .map(value => value.toString(16).padStart(2, '0'))
    .join('');
}

export function stringContains(haystack: string, needles: string) {
  return (
    haystack
      .toUpperCase()
      .replace(SEARCH_REG_EXP, '')
      .indexOf(needles) !== -1
  );
}
