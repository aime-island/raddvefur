import * as React from 'react';
import { connect } from 'react-redux';

import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { TimelineStat } from '../../../../stores/competition';

const colors = ['#629ff4', '#ff4f5e', '#59cbb7'];

interface PropsFromState {
  api: API;
}

interface ChartProps {
  //genderDistribution: GenderStat[];
}

type Props = PropsFromState & ChartProps;

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

interface State {
  stats: TimelineStat[];
}

class TimelineChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      stats: [],
    };
  }

  componentDidMount = async () => {
    const { api } = this.props;
    const stats = await api.getTimeline();
    this.setState({ stats });
  };

  render() {
    const { stats } = this.state;
    return (
      <ResponsiveContainer>
        <CartesianChart resultSet={stats} ChartComponent={LineChart}>
          {stats.map((stats: any, i: any) => (
            <Line
              type={'step'}
              dot={false}
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

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(TimelineChart);
