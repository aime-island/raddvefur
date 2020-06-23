import { getConfig } from '../../config-helper';
import { hash } from '../utility';
import StatsSql, { getStatsInstance } from './db/stats';
import Schema from './db/schema';
import ClipTable, { DBClipWithVoters } from './db/tables/clip-table';
import VoteTable from './db/tables/vote-table';
import { v4 as uuidv4 } from 'uuid';

// When getting new sentences/clips we need to fetch a larger pool and shuffle it to make it less
// likely that different users requesting at the same time get the same data
const SHUFFLE_SIZE = 500;

export default class StatsDB {
  clip: ClipTable;
  statsSql: StatsSql;
  schema: Schema;
  vote: VoteTable;

  constructor() {
    this.statsSql = getStatsInstance();
  }

  async getGender(): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
      SELECT
        CASE
          WHEN clips.sex = 'karl' THEN 'Karl'
          WHEN clips.sex = 'kona' THEN 'Kona'
          WHEN clips.sex = 'annad' THEN 'Annað'
          ELSE 'Óuppgefið'
        END sex,
        count(clips.id) count
      FROM
        clips
      GROUP BY
        1
      ORDER BY
        2 DESC
      LIMIT
        10000
      `
    );
    return rows;
  }

  async getAge(): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
      SELECT 
        CASE
          WHEN clips.age IN (6, 7, 8, 9) THEN '06-9 ára'
          WHEN clips.age IN (10, 11, 12) THEN '10-12 ára'
          WHEN clips.age = 'ungur_unglingur' THEN '13-17 ára'
          WHEN clips.age IN (13, 14, 15, 16, 17) THEN '13-17 ára'
          WHEN clips.age = 'unglingur' THEN '18-29 ára'
          WHEN clips.age = 'tvitugt' THEN '18-29 ára'
          WHEN clips.age = 'thritugt' THEN '30-39 ára'
          WHEN clips.age = 'fertugt' THEN '40-49 ára'
          WHEN clips.age = 'fimmtugt' THEN '50-59 ára'
          WHEN clips.age = 'sextugt' THEN '60-69 ára'
          WHEN clips.age = 'sjotugt' THEN '70-79 ára'
          WHEN clips.age = 'attraett' THEN '80-89 ára'
          WHEN clips.age = 'niraett' THEN '90+ ára'
          ELSE '01Óuppgefið'
          END age,
          count(clips.id) cnt
      FROM
          clips
      GROUP BY 1
      ORDER BY 1
      `
    );
    return rows;
  }

  async getAgeGender(): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
          SELECT
          agegroup as age,
            COUNT(
            CASE
              WHEN sex = 'karl' AND (is_valid = 0 OR is_valid IS NULL) THEN 1
              ELSE NULL
            End
          ) as karl,
            COUNT(
            CASE
              WHEN sex = 'karl' AND is_valid = 1 THEN 1
              ELSE NULL
            End
          ) as karl_valid,
            COUNT(
            CASE
              WHEN sex = 'kona' AND (is_valid = 0 OR is_valid IS NULL)  THEN 1
              ELSE NULL
            End
          ) as kona,
            COUNT(
            CASE
              WHEN sex = 'kona' AND is_valid = 1 THEN 1
              ELSE NULL
            End
          ) as kona_valid,
            COUNT(
            CASE
              WHEN is_valid = 0 or is_valid IS NULL THEN 1
            END
          ) as total,
            COUNT(
            CASE
              WHEN is_valid = 1 THEN 1
            END
          ) as total_valid
        FROM
          (SELECT
            *,
            CASE
            WHEN clips.age IN ('6', 7, 8, 9) THEN '06-9 ára'
            WHEN clips.age IN (10, 11, 12) THEN '10-12 ára'
            WHEN clips.age IN (13, 14, 15, 16, 17) THEN '13-17 ára'
            WHEN clips.age = 'ungur_unglingur' THEN '13-17 ára'
            WHEN clips.age = 'unglingur' THEN '18-19 ára'
            WHEN clips.age = 'tvitugt' THEN '20-29 ára'
            WHEN clips.age = 'thritugt' THEN '30-39 ára'
            WHEN clips.age = 'fertugt' THEN '40-49 ára'
            WHEN clips.age = 'fimmtugt' THEN '50-59 ára '
            WHEN clips.age = 'sextugt' THEN '60-69 ára'
            WHEN clips.age = 'sjotugt' THEN '70-79 ára'
            WHEN clips.age = 'attraett' THEN '80-89 ára'
            WHEN clips.age = 'niraett' THEN '90+ ára'
            ELSE NULL
          END agegroup
          FROM
            clips
          ) ages
        WHERE
          agegroup IS NOT NULL
        GROUP BY
          agegroup
            `,
      []
    );
    return rows;
  }

  async getMilestoneGroups(): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
        SELECT
          groups as hopur,
            COUNT(
            CASE
              WHEN sex = 'karl' AND (is_valid = 0 OR is_valid IS NULL) THEN 1
              ELSE NULL
            End
          ) as karl,
            COUNT(
            CASE
              WHEN sex = 'karl' AND is_valid = 1 THEN 1
              ELSE NULL
            End
          ) as karl_valid,
            COUNT(
            CASE
              WHEN sex = 'kona' AND (is_valid = 0 OR is_valid IS NULL)  THEN 1
              ELSE NULL
            End
          ) as kona,
            COUNT(
            CASE
              WHEN sex = 'kona' AND is_valid = 1 THEN 1
              ELSE NULL
            End
          ) as kona_valid,
            COUNT(
            CASE
              WHEN is_valid = 0 or is_valid IS NULL THEN 1
            END
          ) as total,
            COUNT(
            CASE
              WHEN is_valid = 1 THEN 1
            END
          ) as total_valid
        FROM
          (SELECT
            *,
            CASE
            WHEN
              clips.age IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 'ungur_unglingur')
            THEN 'child'
            WHEN
              native_language = 'islenska'
            AND
              clips.age IN ('unglingur', 'tvitugt', 'thritugt', 'fertugt', 'fimmtugt', 'sextugt', 'sjotugt', 'attraett', 'niraett')
            THEN 'adult'
            WHEN
              native_language != 'islenska'
            AND
              native_language != ''
                AND
              clips.age IN ('unglingur', 'tvitugt', 'thritugt', 'fertugt', 'fimmtugt', 'sextugt', 'sjotugt', 'attraett', 'niraett')
                THEN 'adult_l2'
            ELSE NULL
          END groups
          FROM
            clips
          ) ages
        WHERE
          groups IS NOT NULL
        GROUP BY
          groups
        ORDER BY
          total_valid
        DESC
        `,
      []
    );
    return rows;
  }

  async getConfirmedAge(gender: string): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
        SELECT
          *
        FROM
          (SELECT
            CASE
            WHEN clips.age IN (6, 7, 8, 9) THEN '06-9 ára'
            WHEN clips.age IN (10, 11, 12) THEN '10-12 ára'
            WHEN clips.age IN (13, 14, 15, 16, 17) THEN '13-17 ára'
            WHEN clips.age = 'ungur_unglingur' THEN '13-17 ára'
            WHEN clips.age = 'unglingur' THEN '18-19 ára'
            WHEN clips.age = 'tvitugt' THEN '20-29 ára'
            WHEN clips.age = 'thritugt' THEN '30-39 ára'
            WHEN clips.age = 'fertugt' THEN '40-49 ára'
            WHEN clips.age = 'fimmtugt' THEN '50-59 ára '
            WHEN clips.age = 'sextugt' THEN '60-69 ára'
            WHEN clips.age = 'sjotugt' THEN '70-79 ára'
            WHEN clips.age = 'attraett' THEN '80-89 ára'
            WHEN clips.age = 'niraett' THEN '90+ ára'
            ELSE NULL
          END age,
            COUNT(
            CASE
              WHEN clips.is_valid = 1 THEN 1
              ELSE NULL
            End
          ) as stadfest,
            COUNT(
            CASE
              WHEN clips.is_valid IS NULL THEN 1
              ELSE NULL
            End
          ) as ostadfest,
            COUNT(
            CASE
              WHEN clips.is_valid = 0 THEN 1
              ELSE NULL
            End
          ) as ogilt,
            COUNT(
            *
          ) as total
          FROM
            clips
          WHERE
              sex = ?
          GROUP BY
            age) genders
        WHERE
          age IS NOT NULL
        GROUP BY
          age
        `,
      [gender]
    );
    return rows;
  }

  async getCompetitionTimeline(): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
      SELECT
        cast(created_at as date) as date,
        count(client_id) as cnt
      FROM 
        clips
      WHERE 
        created_at > '2020-04-14'
      AND 
        created_at < '2020-05-11'
      AND 
        institution <> ''
      GROUP BY
        date
      `,
      []
    );
    return rows;
  }

  async getTimeline(): Promise<any> {
    const [rows] = await this.statsSql.query(
      `
      SELECT
        cast(created_at as date) as date,
        count(client_id) as cnt
      FROM 
        clips
      GROUP BY
        date
      `,
      []
    );
    return rows;
  }
}
