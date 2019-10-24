import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  ArgumentAxis,
  AreaSeries,
  Legend,
  Title,
} from '@devexpress/dx-react-chart-material-ui';
import {
  stackOffsetWiggle,
  stackOrderInsideOut,
  curveCatmullRom,
  area,
} from 'd3-shape';
import { EventTracker, HoverState } from '@devexpress/dx-react-chart';

import dummyData from './dummy-data';

import { Stack, Animation } from '@devexpress/dx-react-chart';

const Area = (props: any) => {
  const path = area()
    .x(({ arg }: any) => arg)
    .y1(({ val }: any) => val)
    .y0(({ startVal }: any) => startVal)
    .curve(curveCatmullRom);

  return <AreaSeries.Path {...props} path={path} />;
};

const titleStyle = { marginRight: '120px' };
const TitleText = (props: any) => <Title.Text {...props} style={titleStyle} />;

const chartStyle = { paddingLeft: '20px' };
type data = {
  age: string;
  karl: number;
  kona: number;
  annad: number;
};

type Props = {
  data: data[];
};

type State = {
  data: any[];
};

export default class Steamgraph extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: [],
    };
  }

  render() {
    const chartData = this.props.data;

    return (
      <Paper elevation={0}>
        <Chart
          data={chartData}
          /* style={chartStyle} */
        >
          <ArgumentAxis
            showTicks={false}
            showLine={false}
            indentFromAxis={15}
            tickFormat={() => tick => tick}
          />

          <AreaSeries
            name="Karlar"
            valueField="karl"
            argumentField="age"
            seriesComponent={Area}
            color="#629ff4"
          />

          <AreaSeries
            name="Konur"
            valueField="kona"
            argumentField="age"
            seriesComponent={Area}
            color="#ff4f5e"
          />

          <AreaSeries
            name="Annað"
            valueField="annad"
            argumentField="age"
            seriesComponent={Area}
            color="#59cbb7"
          />
          <Animation />
          <Legend />
          <Stack
            stacks={[{ series: ['Karlar', 'Konur', 'Annað'] }]}
            offset={stackOffsetWiggle}
            order={stackOrderInsideOut}
          />
          <Title text="Dreifni Samróms" textComponent={TitleText} />
        </Chart>
      </Paper>
    );
  }
}
