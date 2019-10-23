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
      <Paper>
        <Chart
          data={chartData}
          /* style={{ paddingLeft: '20px' }} */
        >
          <ArgumentAxis tickFormat={() => tick => tick} />

          <AreaSeries
            name="Konur"
            valueField="kona"
            argumentField="age"
            seriesComponent={Area}
          />
          <AreaSeries
            name="Karlar"
            valueField="karl"
            argumentField="age"
            seriesComponent={Area}
          />
          <AreaSeries
            name="Annað"
            valueField="annad"
            argumentField="age"
            seriesComponent={Area}
          />
          <Animation />
          <Legend />
          <Title text="Dreifni" textComponent={TitleText} />
          <Stack
            stacks={[{ series: ['Konur', 'Karlar', 'Annað'] }]}
            offset={stackOffsetWiggle}
            order={stackOrderInsideOut}
          />
        </Chart>
      </Paper>
    );
  }
}
