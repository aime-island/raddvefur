import * as React from 'react';

export default function FacebookIOSMessage() {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.setAttribute('style', 'display:none;');
  iframe.src = 'youtube://launch?var=val';

  return (
    <div>
      Hæ iphone notandi <br />
      <a href="safaris://https://aime.moon.do" target="_blank">
        Opna með safari
      </a>
    </div>
  );
}
