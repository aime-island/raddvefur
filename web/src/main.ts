import 'focus-visible';
import * as React from 'react';
import { render } from 'react-dom';
import './components/index.css';
import { isFacebook, isIOS, isInstagram } from './utility';

declare var require: any;

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

function renderFacebook() {
  const FacebookIOSMessage = require('./components/pages/iphone/facebook-landing')
    .default;
  render(
    React.createElement(FacebookIOSMessage),
    document.getElementById('root')
  );
}

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const isFace = await isFacebook();
  const isInsta = await isInstagram();
  if (isFace || isInsta) {
    renderFacebook();
    /* const iOS = isIOS();
    if (!iOS) {
      window.location.href = 'https://samromur.page.link/redirect';
    } */
  } else {
    if (typeof window.IntersectionObserver === 'undefined') {
      await require('intersection-observer');
    }
    const App = require('./components/app').default;
    render(React.createElement(App), document.getElementById('root'));
  }
});
