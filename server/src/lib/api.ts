import * as bodyParser from 'body-parser';
import { MD5 } from 'crypto-js';
import { NextFunction, Request, Response, Router } from 'express';
import * as sendRequest from 'request-promise-native';
import { UserClient as UserClientType } from 'common/user-clients';
import { getConfig } from '../config-helper';
import Awards from './model/awards';
import CustomGoal from './model/custom-goal';
import getGoals from './model/goals';
import UserClient from './model/user-client';
import * as Basket from './basket';
import Model from './model';
import Clip from './clip';
import Prometheus from './prometheus';
import { ClientParameterError } from './utility';
import { PassThrough } from 'stream';
import { S3 } from 'aws-sdk';
import { AWS } from './aws';
import Bucket from './bucket';
const Transcoder = require('stream-transcoder');
const requestPromise = require('request-promise-native');
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');
import { ResponseError } from '@sendgrid/helpers/classes';

const PromiseRouter = require('express-promise-router');

export default class API {
  model: Model;
  clip: Clip;
  metrics: Prometheus;
  private s3: S3;
  private bucket: Bucket;
  private emailReady: boolean;

  constructor(model: Model) {
    this.model = model;
    this.clip = new Clip(this.model);
    this.metrics = new Prometheus();
    this.s3 = AWS.getS3();
    this.bucket = new Bucket(this.model, this.s3);
    this.emailReady = this.setSendGrid();
  }

  setSendGrid = (): boolean => {
    const { SENDGRID_KEY } = getConfig();
    if (!SENDGRID_KEY) {
      console.log('No sendgrid api key');
      return false;
    } else {
      sgMail.setApiKey(SENDGRID_KEY);
      sgClient.setApiKey(SENDGRID_KEY);
      return true;
    }
  };

  getRouter(): Router {
    const router = PromiseRouter();

    router.use(bodyParser.json());

    router.use(
      async (request: Request, response: Response, next: NextFunction) => {
        this.metrics.countRequest(request);

        const client_id = request.headers.client_id as string;
        const userAge = request.headers.user_age as string;
        const nonNative = !!parseInt(request.headers.non_native as string);
        request.userAge = userAge;
        request.nonNative = nonNative;
        if (request.user) {
          const accountClientId = await UserClient.findClientId(
            request.user.emails[0].value
          );
          if (accountClientId) {
            request.client_id = accountClientId;
            next();
            return;
          }
        }

        if (client_id) {
          if (await UserClient.hasSSO(client_id)) {
            response.sendStatus(401);
            return;
          } else {
            await this.model.db.saveUserClient(client_id);
          }
          request.client_id = client_id;
        }

        next();
      }
    );

    router.get('/metrics', (request: Request, response: Response) => {
      this.metrics.countPrometheusRequest(request);

      const { registry } = this.metrics;
      response
        .type(registry.contentType)
        .status(200)
        .end(registry.metrics());
    });

    router.use((request: Request, response: Response, next: NextFunction) => {
      this.metrics.countApiRequest(request);
      next();
    });

    router.get('/user_clients', this.getUserClients);
    router.post('/user_clients/:client_id/claim', this.claimUserClient);
    router.get('/user_client', this.getAccount);
    router.patch('/user_client', this.saveAccount);
    router.post(
      '/user_client/avatar/:type',
      bodyParser.raw({ type: 'image/*' }),
      this.saveAvatar
    );
    router.post('/user_client/avatar_clip', this.saveAvatarClip);
    router.get('/user_client/avatar_clip', this.getAvatarClip);
    router.post('/user_client/goals', this.createCustomGoal);
    router.get('/user_client/goals', this.getGoals);
    router.get('/user_client/:locale/goals', this.getGoals);
    router.post('/user_client/awards/seen', this.seenAwards);

    router.get('/:locale/sentences', this.getRandomSentences);
    router.post('/skipped_sentences/:id', this.createSkippedSentence);

    router.use(
      '/:locale?/clips',
      (request: Request, response: Response, next: NextFunction) => {
        this.metrics.countClipRequest(request);
        next();
      },
      this.clip.getRouter()
    );

    router.get('/contribution_activity', this.getContributionActivity);
    router.get('/:locale/contribution_activity', this.getContributionActivity);

    router.get('/user_count', this.getUserCount);
    router.get('/:locale/user_count', this.getUserCount);

    router.get('/leaderboard', this.getLeaderboard);
    router.get('/institution_gender/:institution', this.getInstitutionGender);

    // Stats
    router.get('/stats/timeline', this.getTimeline);
    router.get('/stats/age', this.getAge);
    router.get('/stats/age-gender', this.getAgeGender);
    router.get('/stats/gender', this.getGender);
    router.get('/stats/confirmed-age', this.getConfirmedAge);
    router.get('/stats/milestone-groups', this.getMilestoneGroups);

    // Competition stats
    router.get('/competition/timeline', this.getCompetitionTimeline);

    router.get('/consents/:kennitala', this.getConsent);
    router.post('/consents/:kennitala/:email/', this.createConsent);

    router.get('/requested_languages', this.getRequestedLanguages);
    router.post('/requested_languages', this.createLanguageRequest);

    router.get('/language_stats', this.getLanguageStats);

    router.post('/newsletter/:email', this.subscribeToNewsletter);

    router.post('/:locale/downloaders/:email', this.insertDownloader);

    router.use('*', (request: Request, response: Response) => {
      response.sendStatus(404);
    });

    return router;
  }

  getLeaderboard = async (request: Request, response: Response) => {
    const leaderboard = await this.model.getLeaderboard();
    response.json(leaderboard);
  };

  getInstitutionGender = async (
    { params: { institution } }: Request,
    response: Response
  ) => {
    const genderDistribution = await this.model.getInstitutionGender(
      institution
    );
    response.json(genderDistribution);
  };

  getGender = async (request: Request, response: Response) => {
    const gender = await this.model.getGender();
    response.json(gender);
  };

  getAge = async (request: Request, response: Response) => {
    const age = await this.model.getAge();
    response.json(age);
  };

  getAgeGender = async (request: Request, response: Response) => {
    const ageGender = await this.model.getAgeGender();
    response.json(ageGender);
  };

  getConfirmedAge = async (request: Request, response: Response) => {
    const { headers } = request;
    const gender = decodeURIComponent(headers.gender as string);
    const confirmedAge = await this.model.getConfirmedAge(gender);
    response.json(confirmedAge);
  };

  getMilestoneGroups = async (request: Request, response: Response) => {
    const mGroups = await this.model.getMilestoneGroups();
    response.json(mGroups);
  };

  getCompetitionTimeline = async (request: Request, response: Response) => {
    const competitionTimeline = await this.model.getCompetitionTimeline();
    response.json(competitionTimeline);
  };

  getTimeline = async (request: Request, response: Response) => {
    const timeline = await this.model.getTimeline();
    response.json(timeline);
  };

  getConsent = async (
    { params: { kennitala } }: Request,
    response: Response
  ) => {
    const consent = await this.model.getConsent(kennitala);
    const permission = consent.length > 0;
    response.json(permission);
  };

  addPermission = async (uuid: String) => {
    return this.model.addPermission(uuid);
  };

  createConsent = async (request: Request, response: Response) => {
    const {
      params: { kennitala, email },
    } = request;
    const consentUrl = request.query.consentUrl;
    const id = await this.model.createConsent(email, kennitala);
    const url = `${consentUrl}/c/${id}`;
    const success = await this.sendConsentEmail(email, kennitala, url);
    response.json(success);
  };

  getRandomSentences = async (request: Request, response: Response) => {
    const { userAge, nonNative, client_id, params } = request;
    const sentences = await this.model.findEligibleSentences(
      client_id,
      params.locale,
      parseInt(request.query.count, 10) || 1,
      userAge,
      nonNative
    );

    response.json(sentences);
  };

  getRequestedLanguages = async (request: Request, response: Response) => {
    response.json(await this.model.db.getRequestedLanguages());
  };

  createLanguageRequest = async (request: Request, response: Response) => {
    await this.model.db.createLanguageRequest(
      request.body.language,
      request.client_id
    );
    response.json({});
  };

  createSkippedSentence = async (request: Request, response: Response) => {
    const {
      client_id,
      params: { id },
    } = request;
    await this.model.db.createSkippedSentence(id, client_id);
    response.json({});
  };

  getLanguageStats = async (request: Request, response: Response) => {
    response.json(await this.model.getLanguageStats());
  };

  getUserClients = async ({ client_id, user }: Request, response: Response) => {
    if (!user) {
      response.json([]);
      return;
    }

    const email = user.emails[0].value;
    const userClients: UserClientType[] = [
      { email },
      ...(await UserClient.findAllWithLocales({
        email,
        client_id,
      })),
    ];
    response.json(userClients);
  };

  saveAccount = async ({ body, user }: Request, response: Response) => {
    if (!user) {
      throw new ClientParameterError();
    }
    response.json(await UserClient.saveAccount(user.emails[0].value, body));
  };

  getAccount = async ({ user }: Request, response: Response) => {
    response.json(
      user ? await UserClient.findAccount(user.emails[0].value) : null
    );
  };

  subscribeToNewsletter = async (request: Request, response: Response) => {
    const { email } = request.params;
    const req = {
      method: 'PUT',
      url: '/v3/marketing/contacts',
      body: {
        contacts: [
          {
            email: email,
          },
        ],
      },
    };
    sgClient
      .request(req)
      .then(([res, body]: any) => {
        console.log('Subscribed to newsletter: ', email);
      })
      .catch((error: ResponseError) => {
        console.log('Error subscribing to newsletter');
        console.log(error.response.body);
      });
    response.json({});
  };

  sendConsentEmail = async (email: string, kennitala: string, url: string) => {
    const msg = {
      personalizations: [
        {
          to: [
            {
              email: email,
            },
          ],
        },
      ],
      from: 'samromur@ru.is',
      template_id: 'd-518c7aa7f57e4c7983453c89970af872',
      dynamic_template_data: {
        KENNITALA: kennitala,
        URL: url,
      },
    };
    return sgMail
      .send(msg)
      .then((results: any) => {
        console.log('Success');
        return true;
      })
      .catch((error: any) => {
        console.log('error');
        console.log(error);
        return false;
      });
  };

  saveAvatar = async (
    { body, headers, params, user }: Request,
    response: Response
  ) => {
    let avatarURL;
    let error;
    switch (params.type) {
      case 'default':
        avatarURL = null;
        break;

      case 'gravatar':
        try {
          avatarURL =
            'https://gravatar.com/avatar/' +
            MD5(user.emails[0].value).toString() +
            '.png';
          await sendRequest(avatarURL + '&d=404');
        } catch (e) {
          if (e.name != 'StatusCodeError') {
            throw e;
          }
          error = 'not_found';
        }
        break;

      case 'file':
        avatarURL =
          'data:' +
          headers['content-type'] +
          ';base64,' +
          body.toString('base64');
        console.log(avatarURL.length);
        if (avatarURL.length > 8000) {
          error = 'too_large';
        }
        break;

      default:
        response.sendStatus(404);
        return;
    }

    if (!error) {
      await UserClient.updateAvatarURL(user.emails[0].value, avatarURL);
    }

    response.json(error ? { error } : {});
  };

  saveAvatarClip = async (request: Request, response: Response) => {
    const { client_id, headers, user } = request;

    const folder = client_id;
    const clipFileName = folder + '.wav';
    try {
      // If upload was base64, make sure we decode it first.
      let transcoder;
      if ((headers['content-type'] as string).includes('base64')) {
        // If we were given base64, we'll need to concat it all first
        // So we can decode it in the next step.
        const chunks: Buffer[] = [];
        await new Promise(resolve => {
          request.on('data', (chunk: Buffer) => {
            chunks.push(chunk);
          });
          request.on('end', resolve);
        });
        const passThrough = new PassThrough();
        passThrough.end(
          Buffer.from(Buffer.concat(chunks).toString(), 'base64')
        );
        transcoder = new Transcoder(passThrough);
      } else {
        // For non-base64 uploads, we can just stream data.
        transcoder = new Transcoder(request);
      }

      await Promise.all([
        this.s3
          .upload({
            Bucket: getConfig().BUCKET_NAME,
            Key: clipFileName,
            Body: transcoder
              .audioCodec('pcm_s16le')
              .format('wav')
              .stream(),
          })
          .promise(),
      ]);

      await UserClient.updateAvatarClipURL(user.emails[0].value, clipFileName);

      response.json(clipFileName);
    } catch (error) {
      console.error(error);
      response.statusCode = error.statusCode || 500;
      response.statusMessage = 'save avatar clip error';
      response.json(error);
    }
  };

  getAvatarClip = async (request: Request, response: Response) => {
    const { user } = request;
    let path = await UserClient.getAvatarClipURL(user.emails[0].value);
    path = path[0][0].avatar_clip_url;
    let avatarclip = await this.bucket.getAvatarClipsUrl(path);
    response.json(avatarclip);
  };

  getContributionActivity = async (
    { client_id, params: { locale }, query }: Request,
    response: Response
  ) => {
    response.json(
      await (query.from == 'you'
        ? this.model.db.getContributionStats(locale, client_id)
        : this.model.getContributionStats(locale))
    );
  };

  getUserCount = async (
    { client_id, params: { locale }, query }: Request,
    response: Response
  ) => {
    response.json(await this.model.db.getUserCount(locale, client_id));
  };

  createCustomGoal = async (request: Request, response: Response) => {
    await CustomGoal.create(request.client_id, request.body);
    await this.getGoals(request, response);
    Basket.sync(request.client_id).catch(e => console.error(e));
  };

  getGoals = async (
    { client_id, params: { locale } }: Request,
    response: Response
  ) => {
    response.json({ globalGoals: await getGoals(client_id, locale) });
  };

  claimUserClient = async (
    { client_id, params }: Request,
    response: Response
  ) => {
    if (!(await UserClient.hasSSO(params.client_id)) && client_id) {
      await UserClient.claimContributions(client_id, [params.client_id]);
    }
    response.json({});
  };

  insertDownloader = async (
    { client_id, params }: Request,
    response: Response
  ) => {
    await this.model.db.insertDownloader(params.locale, params.email);
    response.json({});
  };

  seenAwards = async ({ client_id, query }: Request, response: Response) => {
    await Awards.seen(
      client_id,
      query.hasOwnProperty('notification') ? 'notification' : 'award'
    );
    response.json({});
  };
}
