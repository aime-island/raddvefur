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
} from 'recharts';

import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { AgeGenderStat } from '../../../../stores/competition';
import './tooltip.css';

const formatPayload = (payload: readonly TooltipPayload[]) => {
  const karl = payload.find((p: TooltipPayload) => p.dataKey == 'karl');
  const kona = payload.find((p: TooltipPayload) => p.dataKey == 'kona');
  const total = payload.find((p: TooltipPayload) => p.dataKey == 'total');
  return {
    karl: { ...karl },
    kona: { ...kona },
    total: { ...total },
  };
};

const ageFormatter = (item: string | number) => {
  let strengur: string = typeof item == 'number' ? item.toString() : item;
  if (strengur[0] == '0') {
    return strengur.slice(1);
  } else {
    return strengur;
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
        {!!props.label && ageFormatter(props.label)}
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

interface PropsFromState {
  api: API;
}

interface ChartProps {}

type Props = PropsFromState & ChartProps;

interface State {
  ageGenderStats: AgeGenderStat[];
}

class GenderChart extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      ageGenderStats: [],
    };
  }

  componentDidMount = async () => {
    const { api } = this.props;
    const ageGenderStats = await api.getAgeGender();
    this.setState({ ageGenderStats });
  };

  render() {
    const { ageGenderStats } = this.state;

    return (
      <ResponsiveContainer width={'100%'} height={500}>
        <ComposedChart data={ageGenderStats}>
          <XAxis dataKey={'age'} tickFormatter={ageFormatter} />
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
        </ComposedChart>
      </ResponsiveContainer>
    );
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(GenderChart);
