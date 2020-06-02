import * as React from 'react';
import { connect } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { GenderStat } from '../../../../stores/competition';

const colors = ['#629ff4', '#ff4f5e', '#59cbb7', '#2b376c'];

interface PropsFromState {
  api: API;
}

interface ChartProps {}

type Props = PropsFromState & ChartProps;

interface State {
  stats: GenderStat[];
}

class GenderChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      stats: [],
    };
  }

  componentDidMount = async () => {
    const { api } = this.props;
    const stats = await api.getGender();
    this.setState({ stats });
  };

  render() {
    const { stats } = this.state;
    return (
      <ResponsiveContainer width={'100%'} height={350}>
        <PieChart>
          <Pie
            isAnimationActive={false}
            data={stats}
            nameKey={'sex'}
            dataKey={'count'}
            fill="#8884d8">
            {stats.map((_, index) => (
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

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(GenderChart);
