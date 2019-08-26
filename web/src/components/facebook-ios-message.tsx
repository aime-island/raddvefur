import * as React from 'react';

// <a href="x-web-search://?https://aime.moon.do">Opna með safari</a>

export default function FacebookIOSMessage() {
  return (
    <div>
      Hæ iphone notandi <br />
      <link rel="alternate" href="safari://aime.moon.do">
        Opna líka með safari
      </link>
    </div>
  );
}
