import 'focus-visible';
import * as React from 'react';
import { render } from 'react-dom';
import './components/index.css';
import { isFacebook, isFacebookIOS } from './utility';

declare var require: any;

// Safari hack to allow :active styles.
document.addEventListener('touchstart', function() {}, true);

// Start the app when DOM is ready.
document.addEventListener('DOMContentLoaded', async () => {
  const isFace = await isFacebook();
  if (isFace) {
    const isFaceIOS = await isFacebookIOS();
    if (!isFaceIOS) {
      window.location.href = 'http://almannaromur.page.link/is';
    }
  } else {
    if (typeof window.IntersectionObserver === 'undefined') {
      await require('intersection-observer');
    }
    const App = require('./components/app').default;
    render(React.createElement(App), document.getElementById('root'));
  }
});
