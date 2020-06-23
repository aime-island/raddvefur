export interface Division {
  name: string;
  code: string;
}

export interface Institution {
  name: string;
  code: string;
  enrollment: number;
  divisions: Division[];
}

export interface Institutions {
  institutions: Institution[];
}

export interface CompetitionInfo {
  institution: string;
  division: string;
}

export interface InstitutionStat {
  institution: string;
  count: number;
  users: number;
  rank: number;
  ratio?: number;
}

export interface GenderStat {
  sex: string;
  count: number;
}

export interface TimelineStat {
  date: string;
  cnt: number;
}

export interface AgeStat {
  age: string;
  cnt: number;
}

export interface AgeGenderStat {
  age: string;
  karl: number;
  karl_valid: number;
  kona: number;
  kona_valid: number;
  total: number;
  total_valid: number;
}

export interface MilestoneStat {
  hopur: string;
  karl: number;
  karl_valid: number;
  kona: number;
  kona_valid: number;
  total: number;
  total_valid: number;
}

export interface ConfirmedAgeStat {
  age: string;
  stadfest: number;
  ostadfest: number;
  ogilt: number;
  total: number;
}
