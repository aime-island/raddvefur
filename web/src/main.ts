import 'focus-visible';
import * as React from 'react';
import { render } from 'react-dom';
import './components/index.css';
import { isFacebook, isIOS } from './utility';

declare var require: any;

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const isFace = await isFacebook();
  if (isFace) {
    const isFBIOS = await isIOS();
    if (!isFBIOS) {
      window.location.href = 'https://randomwalk.page.link/6SuK';
      //window.location.href = 'http://almannaromur.page.link/is';
    } else {
      //window.location.assign('safari://https://aime.moon.do');
      const FacebookIOSMessage = require('./components/facebook-ios-message')
        .default;
      render(
        React.createElement(FacebookIOSMessage),
        document.getElementById('root')
      );
    }
  } else {
    if (typeof window.IntersectionObserver === 'undefined') {
      await require('intersection-observer');
    }
    const App = require('./components/app').default;
    render(React.createElement(App), document.getElementById('root'));
  }
});
