import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { GlobeIcon, MicIcon, PlayOutlineIcon } from '../../ui/icons';
import Dots from './dots';

import './circle-stats.css';

const CircleStat = ({
  className,
  label,
  value,
  icon,
  ...props
}: { label: string; value: any; icon: React.ReactNode } & React.HTMLProps<
  HTMLDivElement
>) => (
  <div className={'circle-stat ' + (className || '')} {...props}>
    <Dots style={{ width: 70 }} />
    <div className="text">
      <Localized id={label}>
        <div className="label" />
      </Localized>
      <div className="value">{value}</div>
    </div>
    <div className="circle">{icon}</div>
  </div>
);

const formatSeconds = (totalSeconds: number) => {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  if (hours >= 1000) {
    return (hours / 1000).toPrecision(2) + 'k';
  }

  const timeParts = [];

  if (hours > 0) {
    timeParts.push(hours + 'k');
  }

  if (hours < 10 && minutes > 0) {
    timeParts.push(minutes + 'm');
  }

  if (hours == 0 && minutes < 10 && seconds > 0) {
    timeParts.push(seconds + 's');
  }

  return timeParts.join(' ') || '0';
};

export default ({
  className,
  valid,
  total,
  voices,
  ...props
}: { valid: number; total: number; voices: number } & React.HTMLProps<
  HTMLDivElement
>) => (
  <div className={'circle-stats ' + className} {...props}>
    <CircleStat
      className="valid-hours"
      label="validated-hours"
      value={formatSeconds(valid)}
      icon={<PlayOutlineIcon />}
    />
    <CircleStat
      className="total-hours"
      label="recorded-hours"
      value={formatSeconds(total)}
      icon={<MicIcon />}
    />
    <CircleStat
      className="total-voices"
      label="number-of-voices"
      value={voices}
      icon={<GlobeIcon />}
    />
  </div>
);
