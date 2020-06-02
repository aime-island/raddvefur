import * as React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { GenderStat } from '../../../../stores/competition';

const colors = ['#629ff4', '#ff4f5e', '#59cbb7', '#2b376c'];

interface Props {}

const staticGenderDistribution: GenderStat[] = [
  {
    count: 106796,
    sex: 'Konur',
  },
  {
    count: 32973,
    sex: 'Karlar',
  },
  {
    count: 2217,
    sex: 'Annað',
  },
  {
    count: 1755,
    sex: 'Óuppgefið',
  },
];

export default class SexChart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <ResponsiveContainer width={'100%'} height={350}>
        <PieChart>
          <Pie
            isAnimationActive={false}
            data={staticGenderDistribution}
            nameKey={'sex'}
            dataKey={'count'}
            fill="#8884d8">
            {staticGenderDistribution.map((_, index) => (
              <Cell key={index} fill={colors[index]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
