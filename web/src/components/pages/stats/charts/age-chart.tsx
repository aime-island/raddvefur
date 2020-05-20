import { AgeStat } from '../../../../stores/competition';

const stats: AgeStat[] = [
  {
    age: '6-9 ára',
    cnt: 5953,
  },
  {
    age: '10 - 12 ára',
    cnt: 64960,
  },
  {
    age: '13-17 ára',
    cnt: 25239,
  },
  {
    age: '18-29 ára',
    cnt: 13571,
  },
  {
    age: '30-39 ára',
    cnt: 8728,
  },
  {
    age: '40-49 ára',
    cnt: 20453,
  },
  {
    age: '50-59 ára',
    cnt: 4333,
  },

  {
    age: '60-69 ára',
    cnt: 419,
  },
  {
    age: '80-89 ára',
    cnt: 60,
  },
  {
    age: '90+ ára',
    cnt: 26,
  },
];

import * as React from 'react';
import {
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Legend,
  Line,
} from 'recharts';

const colors = [
  '#629ff4',
  '#ff4f5e',
  '#59cbb7',
  '#629ff4',
  '#ff4f5e',
  '#59cbb7',
  '#629ff4',
  '#ff4f5e',
  '#59cbb7',
];

interface Props {
  //genderDistribution: GenderStat[];
}

const CartesianChart = ({ resultSet, children, ChartComponent }: any) => (
  <ResponsiveContainer width={'100%'} height={350}>
    <ChartComponent data={resultSet}>
      <XAxis dataKey={'age'} />
      <YAxis />
      <CartesianGrid />
      {children}
      {/* <Legend /> */}
      {/* <Tooltip label={"fjöldi"} formatter={val => val}/> */}
    </ChartComponent>
  </ResponsiveContainer>
);

export default class AgeCart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    //const { genderDistribution } = this.props;
    return (
      <ResponsiveContainer>
        <CartesianChart resultSet={stats} ChartComponent={AreaChart}>
          {stats.map((stat: any, i: any) => (
            <Area key={'cnt'} dataKey={'cnt'} fill={'#629ff4'} />
          ))}
        </CartesianChart>
      </ResponsiveContainer>
    );
  }
}
