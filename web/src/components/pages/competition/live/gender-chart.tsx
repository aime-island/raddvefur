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

const colors = ['#629ff4', '#ff4f5e', '#59cbb7'];

interface Props {
  genderDistribution: GenderStat[];
}

export default class SexChart extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { genderDistribution } = this.props;
    return (
      <ResponsiveContainer>
        <PieChart>
          <Pie
            isAnimationActive={false}
            data={genderDistribution}
            nameKey="clips__sex"
            dataKey={'clips__count'}
            fill="#8884d8">
            {genderDistribution.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
