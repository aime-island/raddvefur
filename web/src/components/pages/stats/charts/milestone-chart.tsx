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
  TooltipProps,
  TooltipPayload,
  LegendProps,
  LegendPayload,
  Dot,
  Customized,
} from 'recharts';

import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { MilestoneStat } from '../../../../stores/competition';
import './tooltip.css';

const formatPayload = (payload: readonly TooltipPayload[]) => {
  const karl = payload.find((p: TooltipPayload) => p.dataKey == 'karl');
  const kona = payload.find((p: TooltipPayload) => p.dataKey == 'kona');
  const total = payload.find((p: TooltipPayload) => p.dataKey == 'total');
  const m1 = payload.find((p: TooltipPayload) => p.dataKey == 'm1');
  const m2 = payload.find((p: TooltipPayload) => p.dataKey == 'm2');
  const m3 = payload.find((p: TooltipPayload) => p.dataKey == 'm3');
  return {
    karl: { ...karl },
    kona: { ...kona },
    total: { ...total },
  };
};

const tickFormatter = (item: string | number) => {
  let strengur: string = typeof item == 'number' ? item.toString() : item;
  if (strengur == 'child') {
    return 'Börn';
  } else if (strengur == 'adult') {
    return 'Fullorðnir, íslenska móðurmál';
  } else {
    return 'Fullorðnir, annað móðurmál';
  }
};

const CustomTooltip: React.FC<TooltipProps> = props => {
  if (!!!props.payload) {
    return null;
  }
  const payload = formatPayload(props.payload);
  const { karl, kona, total } = payload;
  return (
    <div className="tooltip-container">
      <p className="tooltip-title">
        {!!props.label && tickFormatter(props.label)}
      </p>
      {karl.payload && (
        <span style={{ color: karl.fill }}>
          {karl.name}: {karl.payload.karl + karl.payload.karl_valid}, staðfest:{' '}
          {karl.payload.karl_valid}
        </span>
      )}
      {kona.payload && (
        <span style={{ color: kona.fill }}>
          {kona.name}: {kona.payload.kona + kona.payload.kona_valid}, staðfest:{' '}
          {karl.payload.kona_valid}
        </span>
      )}
      {total.payload && (
        <span style={{ color: total.fill }}>
          {total.name}: {total.payload.total + total.payload.total_valid},
          staðfest: {total.payload.total_valid}
        </span>
      )}
    </div>
  );
};

const colors = ['#629ff4', '#ff4f5e', '#59cbb7', '#2b376c'];

const CustomizedLabel: React.FC<any> = props => {
  const { x, y, stroke, value } = props;
  if (value == 0) {
    return null;
  }
  return (
    <text
      x={x}
      y={y}
      dx={64}
      dy={-10}
      fontSize={15}
      fill={'#2d2d2d'}
      fontWeight={700}
      textAnchor="middle">
      {value}
    </text>
  );
};

const CustomizedDot: React.FC<any> = props => {
  const { cx, cy, stroke, payload, value, legendType } = props;
  if (value == 0) {
    return null;
  }
  if (payload.m1 == value) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x={cx + 60}
        y={cy - 5}
        fill={stroke}
        width={15}
        height={15}
        viewBox="0, 0, 100, 100">
        <polygon points="50 15, 100 100, 0 100" />
      </svg>
    );
  } else if (payload.m2 == value) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x={cx + 60}
        y={cy - 5}
        fill={stroke}
        width={12}
        height={12}
        viewBox="0, 0, 100, 100">
        <rect x="5" y="5" width="90" height="90" />
      </svg>
    );
  } else {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        x={cx + 60}
        y={cy - 5}
        fill={stroke}
        width={12}
        height={12}
        viewBox="0, 0, 100, 100">
        <circle cx="50" cy="50" r="50" />
      </svg>
    );
  }
};

interface PropsFromState {
  api: API;
}

interface ChartProps {}

type Props = PropsFromState & ChartProps;

interface State {
  milestoneStats: MilestoneStat[];
}

class MilestoneChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      milestoneStats: [],
    };
  }

  componentDidMount = async () => {
    const { api } = this.props;
    const milestoneStats = await api.getMilestoneGroups();
    const newMilestoneStats = milestoneStats.map((stat: MilestoneStat) => {
      return {
        ...stat,
        m1: stat.hopur == 'adult' ? 30000 : 0,
        m2: stat.hopur == 'adult' ? 100000 : stat.hopur == 'child' ? 80000 : 0,
        m3:
          stat.hopur == 'adult'
            ? 150000
            : stat.hopur == 'child'
            ? 120000
            : 10000,
      };
    });
    this.setState({ milestoneStats: newMilestoneStats });
  };

  render() {
    const { milestoneStats } = this.state;

    return (
      <ResponsiveContainer width={'100%'} height={500}>
        <ComposedChart data={milestoneStats}>
          <XAxis dataKey={'hopur'} tickFormatter={tickFormatter} />
          <YAxis />
          <Tooltip content={CustomTooltip} />
          <Legend />
          <CartesianGrid />
          <Bar
            legendType={'none'}
            name="Karl staðfest"
            stackId={'a'}
            barSize={20}
            dataKey="karl_valid"
            fill={'#59cbb7'}
          />
          <Bar
            name="Karl"
            stackId={'a'}
            barSize={20}
            dataKey="karl"
            fill={'#629ff4'}
          />

          <Bar
            legendType={'none'}
            name="Kona staðfest"
            stackId={'b'}
            barSize={20}
            dataKey="kona_valid"
            fill={'#59cbb7'}
          />
          <Bar
            name="Kona"
            stackId={'b'}
            barSize={20}
            dataKey="kona"
            fill={'#ff4f5e'}
          />

          <Bar
            legendType={'none'}
            name="Staðfest"
            stackId={'c'}
            barSize={20}
            dataKey="total_valid"
            fill="#59cbb7"
          />
          <Bar
            name="Samtals"
            stackId={'c'}
            barSize={20}
            dataKey="total"
            fill="#2b376c"
          />
          <Bar
            name="Þar af staðfest"
            stackId={'c'}
            barSize={20}
            dataKey="none"
            fill="#59cbb7"
          />
          <Line
            name="M1"
            legendType="triangle"
            type="basisOpen"
            activeDot={false}
            dot={<CustomizedDot />}
            dataKey="m1"
            label={<CustomizedLabel />}
          />
          <Line
            name="M2"
            legendType="square"
            type="basisOpen"
            activeDot={false}
            dot={<CustomizedDot />}
            dataKey="m2"
            label={<CustomizedLabel />}
          />
          <Line
            name="M3"
            legendType="circle"
            type="basisOpen"
            activeDot={false}
            dot={<CustomizedDot />}
            dataKey="m3"
            label={<CustomizedLabel />}
          />
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(MilestoneChart);
