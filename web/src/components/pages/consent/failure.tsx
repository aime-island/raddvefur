import * as React from 'react';
import './consent.css';

class ConsentFailure extends React.Component {
  render() {
    return (
      <div className="consent">
        <div className="text">
          <h1>Tókst ekki</h1>
        </div>
      </div>
    );
  }
}

export default ConsentFailure;
