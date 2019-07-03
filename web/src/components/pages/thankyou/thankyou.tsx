import { Hr } from '../../ui/ui';
import * as React from 'react';

class ThankYou extends React.Component {
  render() {
    return (
      <div>
        <div className="top">
          <div className="waves">
            <img src={require('./images/_1.svg')} />
            <img src={require('./images/_2.svg')} />
            <img src={require('./images/_3.svg')} className="red" />

            <img src={require('./images/fading.svg')} style={{ right: -5 }} />
            <img src={require('./images/Eq.svg')} className="eq" />
          </div>

          <div className="text">
            <div className="inner">
              <h1>Við viljum þakka...</h1>
            </div>
          </div>
        </div>
        <br />

        <div className="language-sections">
          <section className="launched">
            <div className="title-and-search">
              <h1></h1>
            </div>
            <Hr />
            <ul>
              <li>
                <h2>
                  <strong>Málföng</strong>
                </h2>
                <div>
                  <p>Fyrir setningar úr Risamálheildinni (RMH2).</p>
                </div>
              </li>
              <Hr />
              <li>
                <h2>
                  <strong>Kristlaug María Sigurðardóttir</strong>
                </h2>
                <div>
                  <p>
                    Fyrir setningar úr verkum sínum þar á meðal Ávaxtakörfunni.
                  </p>
                </div>
              </li>
              <Hr />
              <li>
                <h2>
                  <strong>Vísindavefurinn</strong>
                </h2>
                <div>
                  <p>Fyrir setningar úr greinum sínum.</p>
                </div>
              </li>
              <Hr />
              <li>
                <h2>
                  <strong>Common Voice</strong>
                </h2>
                <p>
                  Samrómur er byggt á Mozilla verkefninu Common Voice. Við
                  þökkum fallega grafík og góða undirstöðu til að byggja
                  verkefnið okkar ofan á.
                </p>
              </li>
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

export default ThankYou;
