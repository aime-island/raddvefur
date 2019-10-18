import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import './video.css';
import ReactPlayer from 'react-player';

const Video: React.ComponentType = () => {
  return (
    <div className="video">
      <ReactPlayer
        url="https://s3.eu-west-2.amazonaws.com/static.samromur.is/samromur.mp4"
        controls
      />
    </div>
  );
};

export default Video;
