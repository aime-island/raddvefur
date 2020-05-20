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

interface Props {
  genderDistribution: GenderStat[];
}

const staticGenderDistribution: GenderStat[] = [
  {
    clips__count: 106796,
    clips__sex: 'Konur',
  },
  {
    clips__count: 32973,
    clips__sex: 'Karlar',
  },
  {
    clips__count: 2217,
    clips__sex: 'Annað',
  },
  {
    clips__count: 1755,
    clips__sex: 'Óuppgefið',
  },
];

export default class SexChart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { genderDistribution } = this.props;
    return (
      <ResponsiveContainer width={350} height={350}>
        <PieChart>
          <Pie
            isAnimationActive={false}
            data={staticGenderDistribution}
            nameKey={'clips__sex'}
            dataKey={'clips__count'}
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
