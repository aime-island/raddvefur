import * as React from 'react';

import './error.css';

interface Props {
  error: Error;
}

interface State {}

export default class ErrorComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    console.log(this.props.error);
  };

  render() {
    return (
      <div className="error-container">
        <div className="error">
          <p>
            Vefþjónninn er undir álagi. Vinsamlegast reyndu að endurhlaða
            síðuna.
          </p>
          <button className="reload-button" onClick={() => location.reload()}>
            Endurhlaða
          </button>
        </div>
      </div>
    );
  }
}
