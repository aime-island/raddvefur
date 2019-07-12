import * as React from 'react';
import { Hr } from '../../ui/ui';

const Credit = ({ ...props }) => {
  const { who, why } = props;
  return (
    <>
      <li>
        <h2>
          <strong>{who}</strong>
        </h2>
        <div>
          <p>{why}</p>
        </div>
      </li>
      <Hr />
    </>
  );
};

export default Credit;
