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
  clips__sex: string;
  clips__count: number;
}

export interface TimelineStat {
  date: string;
  cnt: number;
}

export interface AgeStat {
  age: string;
  cnt: number;
}
