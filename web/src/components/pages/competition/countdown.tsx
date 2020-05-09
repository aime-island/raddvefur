import * as React from 'react';

import './countdown.css';

const countdownTo = 'May 10 2020, 23:59:59 GMT+0000';

type myState = {
  days: number;
  hours: number;
  mins: number;
  secs: number;
};

export class Countdown extends React.Component<{}, myState> {
  private timer: any;

  constructor(context: any) {
    super(context);
    this.state = {
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
    };
  }

  /**
   * Updates the clock every second
   */
  lowerTimer() {
    let timeDifference = new Date(countdownTo).getTime() - new Date().getTime();

    const segmentedTime = {
      days: 0,
      hours: 0,
      mins: 0,
      secs: 0,
    };

    segmentedTime.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    segmentedTime.hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    segmentedTime.mins = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    segmentedTime.secs = Math.floor((timeDifference % (1000 * 60)) / 1000);

    this.setState(segmentedTime);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.lowerTimer();
    }, 1000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  render() {
    const { days, hours, mins, secs } = this.state;

    return (
      <div className="countdown-clock">
        <p className="countdown-text">
          Keppni lýkur eftir: <span>{hours}</span> klst. <span>{mins}</span> m
          og <span>{secs}</span> s
        </p>
      </div>
    );
  }
}
