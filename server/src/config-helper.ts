import * as fs from 'fs';
import { S3 } from 'aws-sdk';

export type CommonVoiceConfig = {
  VERSION: string;
  PROD: boolean;
  SERVER_PORT: number;
  DB_ROOT_USER: string;
  DB_ROOT_PASS: string;
  MYSQLUSER: string;
  MYSQLPASS: string;
  MYSQLDBNAME: string;
  MYSQLHOST: string;
  STATSSQLHOST: string;
  MYSQLPORT: number;
  BUCKET_NAME: string;
  BUCKET_LOCATION: string;
  ENVIRONMENT: string;
  RELEASE_VERSION?: string;
  SECRET: string;
  S3_CONFIG: S3.Types.ClientConfiguration;
  ADMIN_EMAILS: string;
  AUTH0: {
    DOMAIN: string;
    CLIENT_ID: string;
    CLIENT_SECRET: string;
  };
  BASKET_API_KEY?: string;
  SENDGRID_KEY: string;
  IMPORT_SENTENCES: boolean;
  REDIS_URL: string;
  SENTENCE_VERSION: number;
};

const DEFAULTS: CommonVoiceConfig = {
  VERSION: null, // Migration number (e.g. 20171205171637), null = most recent
  RELEASE_VERSION: null, // release version set by nubis,
  PROD: false, // Set to true for staging and production.
  SERVER_PORT: 9000,
  DB_ROOT_USER: null, // Hidden
  DB_ROOT_PASS: null, // Hidden
  MYSQLUSER: null, // Hidden
  MYSQLPASS: null, // Hidden
  MYSQLDBNAME: null, // Hidden
  MYSQLHOST: null, // Hidden
  STATSSQLHOST: null,
  MYSQLPORT: null, // Hidden
  BUCKET_NAME: null, // Hidden
  BUCKET_LOCATION: '',
  ENVIRONMENT: 'default',
  SECRET: null, // Hidden
  ADMIN_EMAILS: '[]', // array of admin emails, as JSON
  S3_CONFIG: {}, // Hidden
  AUTH0: {
    DOMAIN: '',
    CLIENT_ID: '',
    CLIENT_SECRET: '',
  },
  IMPORT_SENTENCES: true,
  REDIS_URL: null,
  SENDGRID_KEY: null,
  SENTENCE_VERSION: 1,
};

let injectedConfig: CommonVoiceConfig;

export function injectConfig(config: any) {
  injectedConfig = { ...DEFAULTS, ...config };
}

let loadedConfig: CommonVoiceConfig;

export function getConfig(): CommonVoiceConfig {
  if (injectedConfig) {
    return injectedConfig;
  }

  if (loadedConfig) {
    return loadedConfig;
  }

  let config = null;
  try {
    let config_path = process.env.SERVER_CONFIG_PATH || './config.json';
    config = JSON.parse(fs.readFileSync(config_path, 'utf-8'));
  } catch (err) {
    console.error(err, 'could not load config.json, using defaults');
  }
  loadedConfig = { ...DEFAULTS, ...config };

  return loadedConfig;
}
