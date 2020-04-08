import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Institution, InstitutionStat } from '../../../stores/competition';
import { SortIcon } from '../../ui/icons';
import { Spinner } from '../../ui/ui';

import './leaderboard.css';

interface Props {
  institutions: Institution[];
  stats: InstitutionStat[];
}

interface State {
  stats: InstitutionStat[];
  sortByIdentifier: string;
  sortBySequence: boolean;
}

export default class Leaderboard extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      stats: [],
      sortByIdentifier: 'count',
      sortBySequence: true,
    };
  }

  componentWillReceiveProps = () => {
    const { stats } = this.props;
    this.setState({
      stats: [
        {
          institution: '(reyk70',
          users: 325,
          count: 1200,
          rank: 1,
        },
        {
          institution: 'sandg78',
          users: 256,
          count: 1099,
          rank: 2,
        },
        {
          institution: 'hlíða170',
          users: 14,
          count: 1099,
          rank: 3,
        },
        {
          institution: 'akurs23',
          users: 546,
          count: 1095,
          rank: 4,
        },
        {
          institution: 'smára47',
          users: 412,
          count: 1093,
          rank: 5,
        },
        {
          institution: 'árskó159',
          users: 21,
          count: 1073,
          rank: 6,
        },
        {
          institution: 'myllu61',
          users: 362,
          count: 1072,
          rank: 7,
        },
        {
          institution: 'snæla43',
          users: 432,
          count: 1064,
          rank: 8,
        },
        {
          institution: 'lauga22',
          users: 547,
          count: 1062,
          rank: 9,
        },
        {
          institution: 'vestu66',
          users: 351,
          count: 1059,
          rank: 10,
        },
        {
          institution: 'þórsh125',
          users: 76,
          count: 1058,
          rank: 11,
        },
        {
          institution: 'folda31',
          users: 507,
          count: 1049,
          rank: 12,
        },
        {
          institution: 'brekk41',
          users: 455,
          count: 1048,
          rank: 13,
        },
        {
          institution: 'bíldu151',
          users: 35,
          count: 1046,
          rank: 14,
        },
        {
          institution: 'borga77',
          users: 274,
          count: 1042,
          rank: 15,
        },
        {
          institution: 'blönd103',
          users: 136,
          count: 1025,
          rank: 16,
        },
        {
          institution: 'klébe105',
          users: 125,
          count: 1023,
          rank: 17,
        },
        {
          institution: 'eystr167',
          users: 5,
          count: 1020,
          rank: 18,
        },
        {
          institution: 'eskif99',
          users: 150,
          count: 1017,
          rank: 19,
        },
        {
          institution: 'suður144',
          users: 41,
          count: 1016,
          rank: 20,
        },
        {
          institution: 'öxarf157',
          users: 24,
          count: 1016,
          rank: 21,
        },
        {
          institution: 'sólst119',
          users: 91,
          count: 1015,
          rank: 22,
        },
        {
          institution: 'hofga168',
          users: 5,
          count: 1004,
          rank: 23,
        },
        {
          institution: 'flóas109',
          users: 106,
          count: 992,
          rank: 24,
        },
        {
          institution: 'rimas29',
          users: 511,
          count: 985,
          rank: 25,
        },
        {
          institution: 'íslan118',
          users: 92,
          count: 983,
          rank: 26,
        },
        {
          institution: 'salas16',
          users: 587,
          count: 968,
          rank: 27,
        },
        {
          institution: 'tálkn146',
          users: 40,
          count: 958,
          rank: 28,
        },
        {
          institution: 'önund160',
          users: 18,
          count: 952,
          rank: 29,
        },
        {
          institution: 'hvera59',
          users: 370,
          count: 944,
          rank: 30,
        },
        {
          institution: 'vatns12',
          users: 610,
          count: 943,
          rank: 31,
        },
        {
          institution: 'hvols81',
          users: 238,
          count: 942,
          rank: 32,
        },
        {
          institution: 'klett106',
          users: 119,
          count: 931,
          rank: 33,
        },
        {
          institution: 'borga92',
          users: 186,
          count: 921,
          rank: 34,
        },
        {
          institution: 'kársn17',
          users: 583,
          count: 907,
          rank: 35,
        },
        {
          institution: 'stöðv155',
          users: 26,
          count: 903,
          rank: 36,
        },
        {
          institution: 'þjórs140',
          users: 46,
          count: 899,
          rank: 37,
        },
        {
          institution: 'höfða123',
          users: 78,
          count: 894,
          rank: 38,
        },
        {
          institution: 'síðus58',
          users: 372,
          count: 891,
          rank: 39,
        },
        {
          institution: 'vestm28',
          users: 513,
          count: 887,
          rank: 40,
        },
        {
          institution: 'stóru95',
          users: 168,
          count: 886,
          rank: 41,
        },
        {
          institution: 'þinge153',
          users: 31,
          count: 882,
          rank: 42,
        },
        {
          institution: 'flúða113',
          users: 97,
          count: 872,
          rank: 43,
        },
        {
          institution: 'bolun102',
          users: 141,
          count: 871,
          rank: 44,
        },
        {
          institution: 'seyði130',
          users: 71,
          count: 870,
          rank: 45,
        },
        {
          institution: 'gilja55',
          users: 394,
          count: 870,
          rank: 46,
        },
        {
          institution: 'melas15',
          users: 592,
          count: 868,
          rank: 47,
        },
        {
          institution: 'grind30',
          users: 509,
          count: 862,
          rank: 48,
        },
        {
          institution: 'auðar120',
          users: 90,
          count: 860,
          rank: 49,
        },
        {
          institution: 'lágaf6',
          users: 685,
          count: 853,
          rank: 50,
        },
        {
          institution: 'austu45',
          users: 415,
          count: 848,
          rank: 51,
        },
        {
          institution: 'hjall129',
          users: 71,
          count: 842,
          rank: 52,
        },
        {
          institution: 'árbæj11',
          users: 626,
          count: 840,
          rank: 53,
        },
        {
          institution: 'fjall89',
          users: 204,
          count: 833,
          rank: 54,
        },
        {
          institution: 'linda36',
          users: 488,
          count: 831,
          rank: 55,
        },
        {
          institution: 'selás88',
          users: 206,
          count: 830,
          rank: 56,
        },
        {
          institution: 'súðav156',
          users: 24,
          count: 806,
          rank: 57,
        },
        {
          institution: 'lauga162',
          users: 14,
          count: 806,
          rank: 58,
        },
        {
          institution: 'hofss18',
          users: 577,
          count: 799,
          rank: 59,
        },
        {
          institution: 'valsá135',
          users: 55,
          count: 798,
          rank: 60,
        },
        {
          institution: 'ingun56',
          users: 391,
          count: 797,
          rank: 61,
        },
        {
          institution: 'skarð100',
          users: 144,
          count: 787,
          rank: 62,
        },
        {
          institution: 'hellu107',
          users: 119,
          count: 776,
          rank: 63,
        },
        {
          institution: 'þorlá83',
          users: 221,
          count: 770,
          rank: 64,
        },
        {
          institution: 'grund10',
          users: 638,
          count: 768,
          rank: 65,
        },
        {
          institution: 'keldu63',
          users: 358,
          count: 763,
          rank: 66,
        },
        {
          institution: 'nessk87',
          users: 217,
          count: 747,
          rank: 67,
        },
        {
          institution: 'sunnu4',
          users: 711,
          count: 739,
          rank: 68,
        },
        {
          institution: 'lauga69',
          users: 326,
          count: 737,
          rank: 69,
        },
        {
          institution: 'djúpa126',
          users: 75,
          count: 728,
          rank: 70,
        },
        {
          institution: 'holtu127',
          users: 75,
          count: 723,
          rank: 71,
        },
        {
          institution: 'hlíða37',
          users: 485,
          count: 709,
          rank: 72,
        },
        {
          institution: 'garða24',
          users: 529,
          count: 698,
          rank: 73,
        },
        {
          institution: 'vopna122',
          users: 79,
          count: 693,
          rank: 74,
        },
        {
          institution: 'hraun3',
          users: 798,
          count: 690,
          rank: 75,
        },
        {
          institution: 'hólma141',
          users: 44,
          count: 687,
          rank: 76,
        },
        {
          institution: 'vestu114',
          users: 95,
          count: 686,
          rank: 77,
        },
        {
          institution: 'krika108',
          users: 109,
          count: 685,
          rank: 78,
        },
        {
          institution: 'reyða86',
          users: 217,
          count: 683,
          rank: 79,
        },
        {
          institution: 'fossv64',
          users: 357,
          count: 678,
          rank: 80,
        },
        {
          institution: '(reyk49',
          users: 406,
          count: 649,
          rank: 81,
        },
        {
          institution: 'húsas96',
          users: 165,
          count: 649,
          rank: 82,
        },
        {
          institution: 'mennt134',
          users: 59,
          count: 648,
          rank: 83,
        },
        {
          institution: 'glerá71',
          users: 325,
          count: 648,
          rank: 84,
        },
        {
          institution: 'stykk97',
          users: 155,
          count: 642,
          rank: 85,
        },
        {
          institution: 'öldus38',
          users: 482,
          count: 639,
          rank: 86,
        },
        {
          institution: 'sæmun35',
          users: 489,
          count: 635,
          rank: 87,
        },
        {
          institution: 'öldut20',
          users: 568,
          count: 620,
          rank: 88,
        },
        {
          institution: 'vífil133',
          users: 59,
          count: 615,
          rank: 89,
        },
        {
          institution: 'lækja33',
          users: 498,
          count: 611,
          rank: 90,
        },
        {
          institution: 'álfhó8',
          users: 658,
          count: 611,
          rank: 91,
        },
        {
          institution: 'arnar165',
          users: 8,
          count: 591,
          rank: 92,
        },
        {
          institution: 'brekk32',
          users: 500,
          count: 582,
          rank: 93,
        },
        {
          institution: 'hrafn101',
          users: 144,
          count: 581,
          rank: 94,
        },
        {
          institution: 'breið51',
          users: 401,
          count: 579,
          rank: 95,
        },
        {
          institution: 'húnav149',
          users: 37,
          count: 579,
          rank: 96,
        },
        {
          institution: 'árskó67',
          users: 347,
          count: 574,
          rank: 97,
        },
        {
          institution: 'víðis5',
          users: 702,
          count: 564,
          rank: 98,
        },
        {
          institution: 'vætta40',
          users: 465,
          count: 561,
          rank: 99,
        },
        {
          institution: '(reyk74',
          users: 290,
          count: 548,
          rank: 100,
        },
        {
          institution: 'dalsk75',
          users: 285,
          count: 546,
          rank: 101,
        },
        {
          institution: 'grand68',
          users: 345,
          count: 533,
          rank: 102,
        },
        {
          institution: 'norðl13',
          users: 607,
          count: 524,
          rank: 103,
        },
        {
          institution: 'naust54',
          users: 397,
          count: 507,
          rank: 104,
        },
        {
          institution: 'raufa164',
          users: 11,
          count: 485,
          rank: 105,
        },
        {
          institution: 'reykj152',
          users: 35,
          count: 476,
          rank: 106,
        },
        {
          institution: 'brúar145',
          users: 41,
          count: 448,
          rank: 107,
        },
        {
          institution: '(leir115',
          users: 94,
          count: 446,
          rank: 108,
        },
        {
          institution: 'seltj21',
          users: 551,
          count: 445,
          rank: 109,
        },
        {
          institution: 'snæfe82',
          users: 231,
          count: 442,
          rank: 110,
        },
        {
          institution: 'varma110',
          users: 104,
          count: 435,
          rank: 111,
        },
        {
          institution: 'þinge131',
          users: 67,
          count: 435,
          rank: 112,
        },
        {
          institution: 'jónss90',
          users: 196,
          count: 431,
          rank: 113,
        },
        {
          institution: 'mýrda136',
          users: 53,
          count: 428,
          rank: 114,
        },
        {
          institution: 'holta46',
          users: 413,
          count: 421,
          rank: 115,
        },
        {
          institution: 'urrið158',
          users: 21,
          count: 410,
          rank: 116,
        },
        {
          institution: 'breið52',
          users: 398,
          count: 408,
          rank: 117,
        },
        {
          institution: 'rétta57',
          users: 391,
          count: 406,
          rank: 118,
        },
        {
          institution: 'hagas19',
          users: 575,
          count: 404,
          rank: 119,
        },
        {
          institution: 'varmá1',
          users: 931,
          count: 398,
          rank: 120,
        },
        {
          institution: 'vogas72',
          users: 309,
          count: 398,
          rank: 121,
        },
        {
          institution: 'reykh121',
          users: 84,
          count: 386,
          rank: 122,
        },
        {
          institution: 'hörðu2',
          users: 922,
          count: 363,
          rank: 123,
        },
        {
          institution: 'selja9',
          users: 642,
          count: 353,
          rank: 124,
        },
        {
          institution: 'valla14',
          users: 607,
          count: 346,
          rank: 125,
        },
        {
          institution: 'landa79',
          users: 249,
          count: 340,
          rank: 126,
        },
        {
          institution: 'brúar154',
          users: 28,
          count: 337,
          rank: 127,
        },
        {
          institution: 'reykj117',
          users: 93,
          count: 331,
          rank: 128,
        },
        {
          institution: 'fáskr116',
          users: 94,
          count: 313,
          rank: 129,
        },
        {
          institution: '(fell111',
          users: 99,
          count: 311,
          rank: 130,
        },
        {
          institution: 'áslan27',
          users: 519,
          count: 309,
          rank: 131,
        },
        {
          institution: 'horna80',
          users: 238,
          count: 284,
          rank: 132,
        },
        {
          institution: 'ísafi60',
          users: 368,
          count: 279,
          rank: 133,
        },
        {
          institution: 'reykh143',
          users: 42,
          count: 263,
          rank: 134,
        },
        {
          institution: 'gríms169',
          users: 3,
          count: 258,
          rank: 135,
        },
        {
          institution: 'sjála76',
          users: 275,
          count: 241,
          rank: 136,
        },
        {
          institution: 'grund112',
          users: 97,
          count: 235,
          rank: 137,
        },
        {
          institution: 'vatna132',
          users: 65,
          count: 224,
          rank: 138,
        },
        {
          institution: 'háale25',
          users: 521,
          count: 212,
          rank: 139,
        },
        {
          institution: 'hólab26',
          users: 520,
          count: 209,
          rank: 140,
        },
        {
          institution: 'oddey91',
          users: 191,
          count: 207,
          rank: 141,
        },
        {
          institution: 'lækja124',
          users: 77,
          count: 207,
          rank: 142,
        },
        {
          institution: 'hamra94',
          users: 170,
          count: 189,
          rank: 143,
        },
        {
          institution: 'suður142',
          users: 43,
          count: 162,
          rank: 144,
        },
        {
          institution: 'langh7',
          users: 682,
          count: 152,
          rank: 145,
        },
        {
          institution: 'stóru148',
          users: 39,
          count: 148,
          rank: 146,
        },
        {
          institution: 'kerhó150',
          users: 36,
          count: 144,
          rank: 147,
        },
        {
          institution: 'lauga139',
          users: 51,
          count: 143,
          rank: 148,
        },
        {
          institution: 'hvale48',
          users: 410,
          count: 128,
          rank: 149,
        },
        {
          institution: 'hátei42',
          users: 451,
          count: 124,
          rank: 150,
        },
        {
          institution: 'hlíða161',
          users: 16,
          count: 120,
          rank: 151,
        },
        {
          institution: 'flata39',
          users: 477,
          count: 115,
          rank: 152,
        },
        {
          institution: 'ártún93',
          users: 185,
          count: 113,
          rank: 153,
        },
        {
          institution: 'stokk104',
          users: 128,
          count: 102,
          rank: 154,
        },
        {
          institution: 'egils65',
          users: 356,
          count: 99,
          rank: 155,
        },
        {
          institution: 'vestr98',
          users: 151,
          count: 91,
          rank: 156,
        },
        {
          institution: 'þelam128',
          users: 73,
          count: 86,
          rank: 157,
        },
        {
          institution: 'tjarn137',
          users: 52,
          count: 74,
          rank: 158,
        },
        {
          institution: 'gerða84',
          users: 220,
          count: 55,
          rank: 159,
        },
        {
          institution: 'hríse163',
          users: 13,
          count: 49,
          rank: 160,
        },
        {
          institution: 'kirkj147',
          users: 40,
          count: 43,
          rank: 161,
        },
        {
          institution: 'drang166',
          users: 8,
          count: 40,
          rank: 162,
        },
        {
          institution: 'lunda34',
          users: 491,
          count: 37,
          rank: 163,
        },
        {
          institution: 'setbe44',
          users: 420,
          count: 34,
          rank: 164,
        },
        {
          institution: 'greni138',
          users: 52,
          count: 20,
          rank: 165,
        },
        {
          institution: 'álfta53',
          users: 398,
          count: 15,
          rank: 166,
        },
        {
          institution: 'borga73',
          users: 297,
          count: 14,
          rank: 167,
        },
        {
          institution: 'dalví85',
          users: 218,
          count: 12,
          rank: 168,
        },
        {
          institution: 'njarð50',
          users: 403,
          count: 6,
          rank: 169,
        },
        {
          institution: 'kópav62',
          users: 360,
          count: 3,
          rank: 170,
        },
      ],
    });
  };

  sort = (identifier: string, sequence: boolean) => {
    const { stats } = this.state;
    let newStats;
    if (identifier == 'count' || identifier == 'users') {
      if (sequence) {
        newStats = stats.sort((a, b) => b[identifier] - a[identifier]);
      } else {
        newStats = stats.sort((a, b) => a[identifier] - b[identifier]);
      }
    }
    this.setState({
      stats: newStats,
    });
  };

  setSortBy = (id: string) => {
    const { sortByIdentifier, sortBySequence } = this.state;
    let sequence;
    if (sortByIdentifier == id) {
      this.setState({
        sortBySequence: !this.state.sortBySequence,
      });
      sequence = !sortBySequence;
    } else {
      this.setState({
        sortByIdentifier: id,
        sortBySequence: true,
      });
      sequence = true;
    }
    this.sort(id, sequence);
  };

  render() {
    const { stats, sortByIdentifier } = this.state;
    const { institutions } = this.props;
    return (
      <div className="leaderboard-container">
        <div className="leaderboard-header leaderboard-item">
          <span>#</span>
          <span>Nafn</span>
          <div
            className="stat"
            id="users"
            onClick={(e: any) => this.setSortBy(e.target.id)}>
            Þáttakendur
          </div>
          <span className="stat">Hlutfall</span>
          <div
            className="stat"
            id="count"
            onClick={(e: any) => this.setSortBy(e.target.id)}>
            Setningar
          </div>
        </div>
        {stats ? renderStats(stats, institutions) : <Spinner />}
      </div>
    );
  }
}

const renderStats = (stats: InstitutionStat[], institutions: Institution[]) => {
  const getInstitutionName = (code: string): string => {
    const institution = institutions.find(
      (item: Institution) => item.code == code
    );
    if (institution) {
      return institution.name;
    } else {
      return 'Stofnun';
    }
  };

  return stats.map((stat: InstitutionStat) => {
    return (
      <div key={stat.institution} className="leaderboard-item">
        <span>{stat.rank}</span>
        <span>{getInstitutionName(stat.institution)}</span>
        <span className="stat">{stat.users}</span>
        <span className="stat stat-main">
          {(stat.count / stat.users).toFixed(1)}
        </span>
        <span className="stat stat-prop">{stat.count}</span>
      </div>
    );
  }); //Ekki rétt gögn í neðsta spam-inu
};
