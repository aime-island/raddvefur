import { AllGoals, CustomGoalParams } from 'common/goals';
import { LanguageStats } from 'common/language-stats';
import { UserClient } from 'common/user-clients';
import { Locale } from '../stores/locale';
import { User } from '../stores/user';
import { USER_KEY } from '../stores/root';
import { Sentences } from '../stores/sentences';
import { DemoInfo } from '../stores/demographics';
import { CompetitionInfo } from '../stores/competition';

export interface Clip {
  id: string;
  glob: string;
  text: string;
  sound: any;
}

const createObjectURL =
  (window.URL || window.webkitURL || {}).createObjectURL || function() {};

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  isJSON?: boolean;
  headers?: {
    [headerName: string]: string;
  };
  body?: any;
}

const API_PATH = location.origin + '/api/v1';
export default class API {
  private readonly locale: Locale.State;
  private readonly user: User.State;

  constructor(locale: Locale.State, user: User.State) {
    this.locale = locale;
    this.user = user;
  }

  private async fetch(path: string, options: FetchOptions = {}): Promise<any> {
    const { method, headers, body, isJSON } = Object.assign(
      { isJSON: true },
      options
    );

    const finalHeaders = Object.assign(
      isJSON
        ? {
            'Content-Type': 'application/json; charset=utf-8',
          }
        : {},
      headers
    );
    if (path.startsWith(location.origin) && !this.user.account) {
      finalHeaders.client_id = this.user.userId;
    }
    if (this.user.demographicInfo.age != null) {
      finalHeaders.user_age = this.user.demographicInfo.age;
    }
    if (this.user.demographicInfo.native_language != null) {
      finalHeaders.non_native = (this.user.demographicInfo.native_language !=
      'islenska'
        ? 1
        : 0
      ).toString();
    }

    const response = await fetch(path, {
      method: method || 'GET',
      headers: finalHeaders,
      credentials: 'same-origin',
      body: body
        ? body instanceof Blob
          ? body
          : JSON.stringify(body)
        : undefined,
    });
    if (response.status == 401) {
      localStorage.removeItem(USER_KEY);
      location.reload();
      return;
    }
    if (response.status >= 400) {
      if (response.statusText === 'save_clip_error') {
        throw new Error(response.statusText);
      }
      throw new Error(await response.text());
    }
    return isJSON ? response.json() : response.text();
  }

  forLocale(locale: string) {
    return new API(locale, this.user);
  }

  getLocalePath() {
    return this.locale ? API_PATH + '/' + this.locale : API_PATH;
  }

  getClipPath() {
    return this.getLocalePath() + '/clips';
  }

  fetchRandomSentences(count: number = 1): Promise<Sentences.Sentence[]> {
    return this.fetch(`${this.getLocalePath()}/sentences?count=${count}`);
  }

  async getLeaderboard() {
    return this.fetch(`${API_PATH}/leaderboard`);
  }

  async getInstitutionGender(institution: string) {
    return this.fetch(`${API_PATH}/institution_gender/${institution}`);
  }

  async getGender() {
    return this.fetch(`${API_PATH}/stats/gender`);
  }

  async getAge() {
    return this.fetch(`${API_PATH}/stats/age`);
  }

  async getAgeGender() {
    return this.fetch(`${API_PATH}/stats/age-gender`);
  }

  async getConfirmedAge(gender: string) {
    return this.fetch(`${API_PATH}/stats/confirmed-age`, {
      headers: {
        gender: encodeURIComponent(gender),
      },
    });
  }

  async getMilestoneGroups() {
    return this.fetch(`${API_PATH}/stats/milestone-groups`);
  }

  async getCompetitionTimeline() {
    return this.fetch(`${API_PATH}/competition/timeline`);
  }

  async getTimeline() {
    return this.fetch(`${API_PATH}/stats/timeline`);
  }

  async checkKennitala(kennitala: string) {
    return this.fetch(`${API_PATH}/consents/${kennitala}`);
  }

  async sendConsentEmail(kennitala: string, email: string) {
    const urlOrigin = window.location.origin;
    return this.fetch(
      `${API_PATH}/consents/${kennitala}/${email}?consentUrl=${urlOrigin}`,
      {
        method: 'POST',
      }
    );
  }

  async fetchInstitutions(): Promise<any> {
    return this.fetch(`/competition/institutions`);
  }

  async fetchRandomClips(count: number = 1): Promise<Clip[]> {
    return new Promise<Clip[]>((resolve, reject) => {
      const getBlob = (url: any): Promise<any> => {
        return fetch(url)
          .then(r => r.blob())
          .then(blob => createObjectURL(blob));
      };
      let newClips: Clip[] = [];
      this.fetch(`${this.getClipPath()}?count=${count}`)
        .then((clips: Clip[]) => {
          let waitingClips = clips.map(async clip => {
            let newSound = await getBlob(clip.sound);
            let newClip = {
              id: clip.id,
              glob: clip.glob,
              text: clip.text,
              sound: newSound,
            };
            newClips.push(newClip);
          });
          Promise.all(waitingClips).then(() => {
            resolve(newClips);
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  uploadClip(
    blob: Blob,
    sentenceId: string,
    sentence: string,
    info: DemoInfo,
    userAgent: string,
    competitionInfo: CompetitionInfo
  ): Promise<void> {
    return this.fetch(this.getClipPath(), {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
        sentence: encodeURIComponent(sentence),
        sentence_id: sentenceId,
        sex: info.sex,
        age: info.age,
        native_language: info.native_language,
        user_agent: userAgent,
        institution: competitionInfo.institution,
        division: competitionInfo.division,
      },
      body: blob,
    });
  }

  saveVote(id: string, isValid: boolean): Promise<Event> {
    return this.fetch(`${this.getClipPath()}/${id}/votes`, {
      method: 'POST',
      body: { isValid },
    });
  }

  fetchValidatedHours(): Promise<number> {
    return this.fetch(this.getClipPath() + '/validated_hours');
  }

  fetchDailyClipsCount(): Promise<number> {
    return this.fetch(this.getClipPath() + '/daily_count');
  }

  fetchDailyVotesCount(): Promise<number> {
    return this.fetch(this.getClipPath() + '/votes/daily_count');
  }

  fetchLocaleMessages(locale: string): Promise<string> {
    return this.fetch(`/locales/${locale}/messages.ftl`, {
      isJSON: false,
    });
  }

  async fetchCrossLocaleMessages(): Promise<string[][]> {
    return Object.entries(
      await this.fetch(`/cross-locale-messages.json`)
    ) as string[][];
  }

  fetchRequestedLanguages(): Promise<string[]> {
    return this.fetch(`${API_PATH}/requested_languages`);
  }

  requestLanguage(language: string): Promise<void> {
    return this.fetch(`${API_PATH}/requested_languages`, {
      method: 'POST',
      body: { language },
    });
  }

  async fetchLanguageStats(): Promise<LanguageStats> {
    return this.fetch(`${API_PATH}/language_stats`);
  }

  fetchDocument(name: 'privacy' | 'terms' | 'cookies'): Promise<string> {
    return this.fetch(`/${name}/${this.locale}.html`, {
      isJSON: false,
    });
  }

  skipSentence(id: string) {
    return this.fetch(`${API_PATH}/skipped_sentences/` + id, {
      method: 'POST',
    });
  }

  fetchClipsStats(
    locale?: string
  ): Promise<{ date: string; total: number; valid: number }[]> {
    return this.fetch(API_PATH + (locale ? '/' + locale : '') + '/clips/stats');
  }

  fetchClipVoices(locale?: string): Promise<{ date: string; value: number }[]> {
    return this.fetch(
      API_PATH + (locale ? '/' + locale : '') + '/clips/voices'
    );
  }

  fetchContributionActivity(
    from: 'you' | 'everyone',
    locale?: string
  ): Promise<{ date: string; value: number }[]> {
    return this.fetch(
      API_PATH +
        (locale ? '/' + locale : '') +
        '/contribution_activity?from=' +
        from
    );
  }

  fetchUserCount(from: 'you' | 'everyone', locale?: string): Promise<number> {
    return this.fetch(
      API_PATH + (locale ? '/' + locale : '') + '/user_count?from=' + from
    );
  }

  fetchUserClients(): Promise<UserClient[]> {
    return this.fetch(API_PATH + '/user_clients');
  }

  fetchAccount(): Promise<UserClient> {
    return this.fetch(API_PATH + '/user_client');
  }

  saveAccount(data: UserClient): Promise<UserClient> {
    return this.fetch(API_PATH + '/user_client', {
      method: 'PATCH',
      body: data,
    });
  }

  subscribeToNewsletter(email: string): Promise<void> {
    return this.fetch(API_PATH + '/newsletter/' + email, {
      method: 'POST',
    });
  }

  saveAvatar(type: 'default' | 'file' | 'gravatar', file?: Blob) {
    return this.fetch(API_PATH + '/user_client/avatar/' + type, {
      method: 'POST',
      isJSON: false,
      ...(file ? { body: file } : {}),
    }).then(body => JSON.parse(body));
  }

  saveAvatarClip(blob: Blob): Promise<void> {
    return this.fetch(API_PATH + '/user_client/avatar_clip', {
      method: 'POST',
      headers: {
        'Content-Type': blob.type,
      },
      body: blob,
    })
      .then(body => body)
      .catch(err => err);
  }

  fetchAvatarClip() {
    return this.fetch(API_PATH + '/user_client/avatar_clip');
  }

  fetchLeaderboard(type: 'clip' | 'vote', cursor?: [number, number]) {
    return this.fetch(
      this.getClipPath() +
        (type == 'clip' ? '' : '/votes') +
        '/leaderboard' +
        (cursor ? '?cursor=' + JSON.stringify(cursor) : '')
    );
  }

  createGoal(body: CustomGoalParams): Promise<AllGoals> {
    return this.fetch(API_PATH + '/user_client/goals', {
      method: 'POST',
      body,
    });
  }

  fetchGoals(locale?: string): Promise<AllGoals> {
    return this.fetch(
      API_PATH + '/user_client' + (locale ? '/' + locale : '') + '/goals'
    );
  }

  claimAccount(): Promise<void> {
    return this.fetch(
      API_PATH + '/user_clients/' + this.user.userId + '/claim',
      { method: 'POST' }
    );
  }

  saveHasDownloaded(email: string): Promise<void> {
    return this.fetch(this.getLocalePath() + '/downloaders/' + email, {
      method: 'POST',
    });
  }

  seenAwards(kind: 'award' | 'notification' = 'award'): Promise<void> {
    return this.fetch(
      API_PATH +
        '/user_client/awards/seen' +
        (kind == 'notification' ? '?notification' : ''),
      {
        method: 'POST',
      }
    );
  }
}
