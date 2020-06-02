import * as React from 'react';

import './container.css';

interface Props {
  title: string;
  children: React.ReactNode;
}

export const ChartContainer: React.FC<Props> = ({ children, title }) => {
  return (
    <div className="chart-container">
      <h3 className="title">{title}</h3>
      {children}
    </div>
  );
};

export default ChartContainer;
