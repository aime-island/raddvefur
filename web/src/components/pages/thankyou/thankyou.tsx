import { Hr } from '../../ui/ui';
import * as React from 'react';
import CREDITS from './CREDITS';

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
              {CREDITS.map((c, i) => (
                <Credit key={i} who={c.who} why={c.why} />
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }
}

const Credit = ({ ...props }) => {
  const { who, why } = props;
  return (
    <>
      <li>
        <h2>
          <strong>{who}</strong>
        </h2>
        <div>
          <p>{why}</p>
        </div>
      </li>
      <Hr />
    </>
  );
};

export default ThankYou;
