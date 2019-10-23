import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  Chart,
  BarSeries,
  Title,
  ArgumentAxis,
  ValueAxis,
  Legend,
} from '@devexpress/dx-react-chart-material-ui';
import {
  Animation,
  ArgumentScale,
  ValueScale,
} from '@devexpress/dx-react-chart';
import { scaleBand } from 'd3-scale';
import { withStyles } from '@material-ui/core/styles';

const legendStyles: any = {
  root: {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'row',
  },
};
const legendLabelStyles: any = (theme: any) => ({
  label: {
    paddingTop: theme.spacing(1),
  },
});
const legendItemStyles: any = {
  item: {
    flexDirection: 'column',
  },
};

const LegendRootBase: any = ({ classes, ...restProps }: any) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const LegendLabelBase: any = ({ classes, ...restProps }: any) => (
  <Legend.Label {...restProps} className={classes.label} />
);
const LegendItemBase: any = ({ classes, ...restProps }: any) => (
  <Legend.Item {...restProps} className={classes.item} />
);
const LegendRoot: any = withStyles(legendStyles, { name: 'LegendRoot' })(
  LegendRootBase
);
const LegendLabel: any = withStyles(legendLabelStyles, { name: 'LegendLabel' })(
  LegendLabelBase
);
const LegendItem: any = withStyles(legendItemStyles, { name: 'LegendItem' })(
  LegendItemBase
);

const Label = ({ text, ...props }: any) => (
  <ValueAxis.Label {...props} text={`${Math.abs(text)}%`} />
);
const modifyDomain = ([start, end]: any) => {
  const threshold = Math.ceil(Math.max(Math.abs(start), Math.abs(end)));
  return [-threshold, threshold];
};

type data = {
  age: string;
  karl: number;
  kona: number;
  annad: number;
};

type dummyData = {
  age: string;
  male: number;
  female: number;
};

type Props = {
  data: data[];
};

type State = {
  data: any[];
};

export default class Pyramid extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      data: [
        {
          age: '0-4',
          male: -4.6,
          female: 4.3,
        },
        {
          age: '5-9',
          male: -4.4,
          female: 4.2,
        },
        {
          age: '10-14',
          male: -4.2,
          female: 4.0,
        },
        {
          age: '15-19',
          male: -4.0,
          female: 3.8,
        },
        {
          age: '20-24',
          male: -3.9,
          female: 3.7,
        },
        {
          age: '25-29',
          male: -4.0,
          female: 3.8,
        },
        {
          age: '30-34',
          male: -4.0,
          female: 3.8,
        },
        {
          age: '35-39',
          male: -3.5,
          female: 3.4,
        },
        {
          age: '40-44',
          male: -3.2,
          female: 3.1,
        },
        {
          age: '45-49',
          male: -3.1,
          female: 3.1,
        },
        {
          age: '50-54',
          male: -2.8,
          female: 2.8,
        },
        {
          age: '55-59',
          male: -2.4,
          female: 2.5,
        },
        {
          age: '60-64',
          male: -2.0,
          female: 2.1,
        },
        {
          age: '65-69',
          male: -1.6,
          female: 1.8,
        },
        {
          age: '70-74',
          male: -1.1,
          female: 1.2,
        },
        {
          age: '75-79',
          male: -0.7,
          female: 0.9,
        },
        {
          age: '80-84',
          male: -0.4,
          female: 0.6,
        },
        {
          age: '85-89',
          male: -0.2,
          female: 0.3,
        },
        {
          age: '90+',
          male: -0.1,
          female: 0.1,
        },
      ],
    };
  }

  render() {
    const chartData: data[] = false ? null : this.props.data;
    return (
      <Paper>
        <Chart data={chartData} rotated>
          <ArgumentScale factory={scaleBand} />
          <ArgumentAxis />
          <ValueScale modifyDomain={modifyDomain} />
          <ValueAxis labelComponent={Label} />

          <BarSeries
            name="Karlar"
            valueField="karl"
            argumentField="age"
            color="#629ff4"
          />
          <BarSeries
            name="Konur"
            valueField="kona"
            argumentField="age"
            color="#ff4f5e"
          />
          <Title text="Dreifni Samróms" />
          <Animation />
          <Legend
            position="bottom"
            rootComponent={LegendRoot}
            itemComponent={LegendItem}
            labelComponent={LegendLabel}
          />
        </Chart>
      </Paper>
    );
  }
}
