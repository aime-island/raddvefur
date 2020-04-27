import * as eventStream from 'event-stream';
import * as fs from 'fs';
import * as path from 'path';
import { PassThrough, Stream } from 'stream';
import promisify from '../../../promisify';
import { hash } from '../../clip';
import { redis, useRedis } from '../../redis';
import { getConfig } from '../../../config-helper';

import fetchSentences, { Sentences, Sentence } from '../../../fetch-sentences';

const CWD = process.cwd();
const SENTENCES_FOLDER = path.resolve(CWD, 'server/data/');

function print(...args: any[]) {
  args.unshift('IMPORT --');
  console.log.apply(console, args);
}

const SENTENCES_PER_CHUNK = 500;

function streamSentences() {
  const stream = new PassThrough({ objectMode: true });
  Promise.all(
    ['kids', 'teens', 'adults'].map(async (type: string) => {
      await fetchSentences(type).then(result => {
        const version = result.version;
        const scripts = result.script;
        let sentences: Sentence[] = [];
        function write() {
          stream.write({
            sentences,
            version,
            type,
          });
          sentences = [];
        }

        return new Promise(resolve => {
          const readable = Stream.Readable.from(scripts).pipe(
            eventStream
              .mapSync((sentence: Sentence) => {
                readable.pause();

                sentences.push(sentence);

                if (sentences.length >= SENTENCES_PER_CHUNK) {
                  write();
                }

                readable.resume();
              })
              .on('end', () => {
                if (sentences.length > 0) {
                  write();
                }
                resolve();
              })
          );
        });
      });
    })
  ).then(() => {
    stream.end();
  });

  return stream;
}

async function importLocaleSentences(pool: any, locale: string) {
  let newVersion = 1;
  const [[{ localeId }]] = await pool.query(
    'SELECT id AS localeId FROM locales WHERE name = ? LIMIT 1',
    [locale]
  );

  await new Promise(async resolve => {
    print('importing', locale);
    const stream = streamSentences();
    stream
      .on(
        'data',
        async ({
          sentences,
          version,
          type,
        }: {
          sentences: Sentence[];
          version: number;
          type: string;
        }) => {
          newVersion = version;
          stream.pause();
          try {
            await pool.query(
              `
              INSERT INTO sentences
              (id, text, is_used, locale_id, source, version, age)
              VALUES ${sentences
                .map(
                  sentence =>
                    `(${[
                      hash(sentence.text),
                      sentence.text,
                      true,
                      localeId,
                      sentence.origin,
                      version,
                      type,
                    ]
                      .map(v => pool.escape(v))
                      .join(', ')})`
                )
                .join(', ')}
              ON DUPLICATE KEY UPDATE
                source = VALUES(source),
                version = VALUES(version),
                is_used = VALUES(is_used);
            `
            );
          } catch (e) {
            console.error(
              'error when inserting sentence batch from "',
              sentences[0],
              '" to "',
              sentences[sentences.length - 1],
              '":',
              e
            );
          }
          stream.resume();
        }
      )
      .on('end', resolve);
  });
  return newVersion;
}

export async function importSentences(pool: any) {
  /* const oldVersion = Number(
      (await useRedis) ? await redis.get('sentences-version') : 0
    );
    const version = ((oldVersion || 0) + 1) % 256; //== max size of version column */

  const locales = ['is'];

  print('locales', locales.join(','));

  const version = await importLocaleSentences(pool, 'is');

  (await useRedis) &&
    (await redis.set('sentences-version', version.toString()));

  await pool.query(
    `
      DELETE FROM sentences
      WHERE id NOT IN (SELECT original_sentence_id FROM clips) AND
            id NOT IN (SELECT sentence_id FROM skipped_sentences) AND
            version <> ?
    `,
    [version]
  );
  await pool.query(
    `
      UPDATE sentences
      SET is_used = FALSE
      WHERE version <> ?
    `,
    [version]
  );

  const [localeCounts] = (await pool.query(
    `
      SELECT locales.name AS locale, COUNT(*) AS count
      FROM sentences
      LEFT JOIN locales ON locale_id = locales.id
      WHERE is_used
      GROUP BY locale_id
    `
  )) as { locale: string; count: number }[][];

  print(
    'sentences',
    JSON.stringify(
      localeCounts.reduce(
        (obj, { count, locale }) => {
          obj[locale] = count;
          return obj;
        },
        {} as { [locale: string]: number }
      ),
      null,
      2
    )
  );
}
