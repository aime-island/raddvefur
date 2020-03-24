export interface Division {
  name: string;
  code: string;
}

export interface Institution {
  name: string;
  code: string;
  divisions: Division[];
}

export interface Institutions {
  institutions: Institution[];
}

export interface CompetitionInfo {
  institution: string;
  division: string;
}
