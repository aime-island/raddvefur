import * as React from 'react';
import { connect } from 'react-redux';

import {
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { AgeStat } from '../../../../stores/competition';

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

interface PropsFromState {
  api: API;
}

interface ChartProps {
  //genderDistribution: GenderStat[];
}

type Props = PropsFromState & ChartProps;

import * as moment from 'moment';
moment.locale('is');
const ageFormatter = (item: string) => {
  if (item[0] == '0' && item[1] == '1') {
    return item.slice(2);
  } else if (item[0] == '0') {
    return item.slice(1);
  } else {
    return item;
  }
};

const CartesianChart = ({ resultSet, children, ChartComponent }: any) => (
  <ResponsiveContainer width="100%" height={350}>
    <ChartComponent data={resultSet}>
      <XAxis tickFormatter={val => ageFormatter(val)} dataKey={'age'} />
      <YAxis />
      <CartesianGrid />
      {children}
      {/* <Legend /> */}
      {/* <Tooltip /> */}
    </ChartComponent>
  </ResponsiveContainer>
);

interface State {
  stats: AgeStat[];
}

class AgeChart extends React.Component<Props, State> {
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

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(AgeChart);
