import * as React from 'react';
import { AGES, SEXES } from '../../../stores/demographics';
import Pyramid from './pyramid';
import Steamgraph from './steamgraph';

import './statistics.css';

type data = {
  age: string;
  karl: number;
  kona: number;
  annad: number;
};

type age = {
  karl: number;
  kona: number;
  annad: number;
};

type Props = {
  data: data[];
};

type State = {
  graphData: data[];
};

export default class Statistics extends React.Component<Props, State> {
  constructor(props: Props, context: any) {
    super(props, context);
    this.state = {
      graphData: [],
    };
  }

  componentDidUpdate = (prevProps: any, prevState: any) => {
    if (prevProps.data != this.props.data) {
      this.updateData();
      console.log('updating');
    }
  };

  updateData = async () => {
    let data = this.props.data;
    let totalClips: number = 0;
    data.map(age => {
      totalClips += age.karl + age.kona + age.annad;
    });
    let graphData: data[] = [];
    data.map(age => {
      let newAge: data = {
        age: AGES[age.age],
        karl: age.karl,
        kona: age.kona,
        annad: age.annad,
      };
      graphData.push(newAge);
    });
    graphData.sort((a: data, b: data) => {
      if (parseInt(a.age[0] + a.age[1]) < parseInt(b.age[0] + b.age[1])) {
        return -1;
      } else if (
        parseInt(a.age[0] + a.age[1]) > parseInt(b.age[0] + b.age[1])
      ) {
        return 1;
      } else {
        return 0;
      }
    });
    console.log(graphData);
    this.setState({ graphData: graphData });
  };

  render() {
    return (
      <div className="statistics">
        {/* <Pyramid data={this.state.graphData} /> */}
        <Steamgraph data={this.state.graphData} />
      </div>
    );
  }
}
