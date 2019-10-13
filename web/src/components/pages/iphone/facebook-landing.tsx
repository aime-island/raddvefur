import * as React from 'react';
import { useRef } from 'react';

import './facebook-landing.css';

export default function FacebookIOSMessage() {
  const SHARE_URL = 'https://samromur.is/';
  const shareURLInputRef = useRef(null);

  return (
    <div className="iphone-landing">
      <div className="iphone-landing-items">
        <h2>Samrómur</h2>
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
        <button
          id="link-copy"
          className="share-button"
          onClick={() => {
            shareURLInputRef.current.select();
            document.execCommand('copy');
          }}>
          <input
            type="text"
            readOnly
            value={SHARE_URL}
            ref={shareURLInputRef}
          />
          <h2 className="copy-link-h2">Afrita hlekk</h2>
        </button>
      </div>
    </div>
  );
}
