import * as React from 'react';
import { useRef } from 'react';
import { FontIcon } from '../../ui/icons';

import './facebook-landing.css';
import imgSrc from './images/Eq.svg';
import imgSrc2 from './images/_3.svg';

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
          Hljóðnemi er ekki studdur hér. Vinsamlegast opnaðu með Chrome, Safari
          eða öðrum vafra.
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
          {/* <FontIcon type="link" className="icon" /> */}
          <h2 className="copy-link-h2"> Afrita hlekk</h2>
        </button>
        <img className="waves" src={imgSrc} />
      </div>
    </div>
  );
}
