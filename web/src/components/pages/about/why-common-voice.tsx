import * as React from 'react';
import { Localized } from 'fluent-react/compat';

import './why-common-voice.css';

const WhyCommonVoice: React.ComponentType<{}> = () => {
  return (
    <>
      <img
        className="wave-top"
        src={require('./images/wave-top.png')}
        alt="Wave"
      />

      <div className="about-container about-heading">
        <div className="about-header">
          <div className="about-header-text">
            <div className="line" />

            <Localized id="about-title">
              <h1 />
            </Localized>

            <Localized id="about-subtitle">
              <h2 />
            </Localized>

            <Localized id="about-header-description">
              <h2 className="header-description" />
            </Localized>
          </div>

          <div className="intro-img">
            <img
              className="robot"
              src={require('./images/robot.png')}
              alt="Waves"
            />
          </div>
        </div>
      </div>
      <div className="deloitte-project">
        <div className="deloitte-project-about">
          <div className="deloitte-project-text">
            <Localized id="deloitte-project-title">
              <h1 className="deloitte-project-text-description" />
            </Localized>

            <Localized id="deloitte-project-description-1">
              <h2 className="deloitte-project-text-description" />
            </Localized>

            <Localized id="deloitte-project-description-2">
              <h2 className="deloitte-project-text-description" />
            </Localized>

            <Localized id="deloitte-project-description-3">
              <h2 className="deloitte-project-text-description" />
            </Localized>

            <Localized id="deloitte-project-description-4">
              <h2 className="deloitte-project-text-description" />
            </Localized>

            <Localized id="deloitte-project-description-5">
              <h2 className="deloitte-project-text-description" />
            </Localized>

            <Localized id="deloitte-project-team-title">
              <h2 className="deloitte-project-team-description" />
            </Localized>

            <Localized id="deloitte-project-team-members">
              <h2 className="deloitte-project-team-description" />
            </Localized>
          </div>
          <div className="deloitte-img">
            <div className="line" />
            <img
              className="aime"
              src={require('./images/sthAnna.png')}
              alt="Aime"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WhyCommonVoice;
