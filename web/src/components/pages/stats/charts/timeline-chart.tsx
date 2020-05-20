import { TimelineStat } from '../../../../stores/competition';

const stats: TimelineStat[] = [
  {
    date: '2020-04-15',
    cnt: 779,
  },
  {
    date: '2020-04-16',
    cnt: 912,
  },
  {
    date: '2020-04-17',
    cnt: 507,
  },
  {
    date: '2020-04-18',
    cnt: 549,
  },
  {
    date: '2020-04-19',
    cnt: 441,
  },
  {
    date: '2020-04-20',
    cnt: 1152,
  },
  {
    date: '2020-04-21',
    cnt: 3111,
  },
  {
    date: '2020-04-22',
    cnt: 1808,
  },
  {
    date: '2020-04-23',
    cnt: 1949,
  },
  {
    date: '2020-04-24',
    cnt: 2306,
  },
  {
    date: '2020-04-25',
    cnt: 1686,
  },
  {
    date: '2020-04-26',
    cnt: 1172,
  },
  {
    date: '2020-04-27',
    cnt: 1454,
  },
  {
    date: '2020-04-28',
    cnt: 5128,
  },
  {
    date: '2020-04-29',
    cnt: 6667,
  },
  {
    date: '2020-04-30',
    cnt: 5989,
  },
  {
    date: '2020-05-01',
    cnt: 1953,
  },
  {
    date: '2020-05-02',
    cnt: 3116,
  },
  {
    date: '2020-05-03',
    cnt: 3637,
  },
  {
    date: '2020-05-04',
    cnt: 7599,
  },
  {
    date: '2020-05-05',
    cnt: 15747,
  },
  {
    date: '2020-05-06',
    cnt: 22880,
  },
  {
    date: '2020-05-07',
    cnt: 18567,
  },
  {
    date: '2020-05-08',
    cnt: 18736,
  },
  {
    date: '2020-05-09',
    cnt: 4698,
  },
  {
    date: '2020-05-10',
    cnt: 11199,
  },
];

import * as React from 'react';
import {
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from 'recharts';

import { GenderStat } from '../../../../stores/competition';

const colors = ['#629ff4', '#ff4f5e', '#59cbb7'];

interface Props {
  //genderDistribution: GenderStat[];
}

import * as moment from 'moment';
moment.locale('is');
const dateFormatter = (item: any) => moment(item).format('DD MMM');

const CartesianChart = ({ resultSet, children, ChartComponent }: any) => (
  <ResponsiveContainer width="100%" height={350}>
    <ChartComponent data={resultSet}>
      <XAxis tickFormatter={val => dateFormatter(val)} dataKey={'date'} />
      <YAxis />
      <CartesianGrid />
      {children}
      {/* <Legend /> */}
      {/* <Tooltip /> */}
    </ChartComponent>
  </ResponsiveContainer>
);
export default class TimelineChart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    //const { genderDistribution } = this.props;
    return (
      <ResponsiveContainer>
        <CartesianChart resultSet={stats} ChartComponent={LineChart}>
          {stats.map((stats: any, i: any) => (
            <Line
              key={i}
              //stackId="a"
              dataKey={'cnt'}
              //name={'Fjöldi'}
              stroke={colors[i]}
            />
          ))}
        </CartesianChart>
      </ResponsiveContainer>
    );
  }
}
