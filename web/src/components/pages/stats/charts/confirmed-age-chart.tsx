import * as React from 'react';
import { connect } from 'react-redux';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { ConfirmedAgeStat } from '../../../../stores/competition';

const colors = ['#629ff4', '#ff4f5e', '#59cbb7', '#2b376c'];

interface PropsFromState {
  api: API;
}

interface ChartProps {}

type Props = PropsFromState & ChartProps;

interface State {
  confirmedAge: ConfirmedAgeStat[];
}

class ConfirmedAgeChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      confirmedAge: [],
    };
  }

  componentDidMount = async () => {
    const { api } = this.props;
    const confirmedAge = await api.getConfirmedAge('karl');
    this.setState({ confirmedAge });
  };

  ageFormatter = (item: string) => {
    if (item[0] == '0') {
      return item.slice(1);
    } else {
      return item;
    }
  };

  render() {
    const { confirmedAge } = this.state;

    return (
      <ResponsiveContainer width={'100%'} height={500}>
        <ComposedChart data={confirmedAge}>
          <XAxis dataKey={'age'} tickFormatter={this.ageFormatter} />
          <YAxis />
          <Tooltip labelFormatter={this.ageFormatter} />
          <Legend />
          <CartesianGrid />
          <Bar
            name="Staðfest"
            stackId="a"
            barSize={30}
            dataKey="stadfest"
            fill={'#629ff4'}
          />
          <Bar
            name="Óstaðfest"
            stackId="a"
            barSize={30}
            dataKey="ostadfest"
            fill={'#ff4f5e'}
          />
          <Bar
            name="Ógilt"
            stackId="a"
            barSize={30}
            dataKey="ogilt"
            fill="#2b376c"
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(ConfirmedAgeChart);
