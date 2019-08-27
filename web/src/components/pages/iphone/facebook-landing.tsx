import * as React from 'react';

import './facebook-landing.css';

export default function FacebookIOSMessage() {
  return (
    <div className="iphone-landing">
      <div className="iphone-landing-items">
        <h2>Almannarómur</h2>
        <div className="iphone-images">
          <img className="cancel" src={require('./images/cancel.png')} />
          <img
            className="microphone"
            src={require('./images/microphone.png')}
          />
        </div>
        <p>
          Hljóðnemi er ekki studdur hér. Vinsamlegast opnaðu með Safari eða
          öðrum vafra.
        </p>
      </div>
    </div>
  );
}
