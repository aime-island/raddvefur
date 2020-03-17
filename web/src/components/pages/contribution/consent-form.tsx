import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Button, LabeledInput } from '../../ui/ui';
import { ModalButtons } from '../../modal/modal';
import API from '../../../services/api';
import './consent-form.css';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { DownIcon } from '../../ui/icons';

interface ConsentInfo {
  email: string;
  kennitala: number;
}

interface State {
  consent: ConsentInfo;
  consentNeeded: boolean;
  message: string;
  showWhyInfo: boolean;
  emailMessage: string;
  emailSent: boolean;
  kennitala: string;
  email: string;
}

interface Props {
  api: API;
  setConsentGranted: () => void;
}

export default class CountModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  state: State = {
    consent: {
      email: '',
      kennitala: null,
    },
    consentNeeded: false,
    message: '',
    showWhyInfo: false,
    emailMessage: '',
    emailSent: false,
    kennitala: '',
    email: '',
  };

  private handleConsentFormChange = (e: any) => {
    if (e.target.name == 'kennitala') {
      this.setState({
        message: '',
      });

      if (e.target.value.length > 10) {
        return;
      }
    } else if (e.target.name == 'email') {
      this.setState({
        emailMessage: '',
      });
    }
    this.setState({
      consent: {
        ...this.state.consent,
        [e.target.name]: e.target.value,
      },
    });
  };

  private setShowWhyInfo = () => {
    this.setState({
      showWhyInfo: !this.state.showWhyInfo,
    });
  };

  private checkKennitala = async () => {
    const { api } = this.props;
    const { kennitala } = this.state.consent;
    if (kennitala == null) {
      return;
    }
    if (kennitala.toString().length != 10) {
      this.setState({
        message: 'Ógild kennitala.',
      });
      return;
    }
    this.setState({
      message: 'Athuga kennitölu...',
    });
    const allowed = await api.checkKennitala(this.state.consent.kennitala);
    if (allowed) {
      this.setState({
        message: 'Kennitala samþykkt.',
        kennitala: kennitala.toString(),
      });
      setTimeout(this.props.setConsentGranted, 1000);
    } else {
      this.setState({
        consentNeeded: true,
        message: 'Kennitala ósamþykkt.',
        kennitala: kennitala.toString(),
      });
      if (this.state.emailSent) {
        setTimeout(() => {
          this.setState({
            message: '',
          });
        }, 1500);
      }
    }
  };

  private validateEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.consent.email.toLowerCase());
  };

  private sendEmail = async () => {
    if (!this.validateEmail()) {
      this.setState({
        emailMessage: 'Ógilt tölvupóstfang.',
      });
      return;
    }
    const { kennitala, email } = this.state.consent;
    this.setState({
      emailMessage: 'Sendi tölvupóst...',
    });
    const sent = await this.props.api.sendConsentEmail(kennitala, email);
    if (sent) {
      this.setState({
        emailMessage: 'Tölvupóstur sendur.',
        email: email,
      });
      setTimeout(() => {
        this.setState({
          emailSent: true,
          message: '',
        });
      }, 1000);
    } else {
      this.setState({
        emailMessage: 'Villa í sendingu tölvupósts.',
      });
    }
  };

  render() {
    const {
      consent,
      consentNeeded,
      message,
      showWhyInfo,
      emailMessage,
      emailSent,
      kennitala,
      email,
    } = this.state;

    return (
      <div>
        {!emailSent ? (
          <div className="info">
            Börn og unglingar verða að fá samþykki forsjáraðila til þess að taka
            þátt í verkefninu Samrómur. Vinsamlegast sláðu inn kennitölu hér að
            neðan.
          </div>
        ) : (
          <div className="info">
            <Localized
              id="consent-email-sent"
              bold={<b />}
              $email={email}
              $kennitala={kennitala}
              listenLink={<LocaleLink to={URLS.LISTEN} blank />}>
              <span />
            </Localized>
          </div>
        )}
        <div className="form-fields">
          <Localized id="consent-form-kennitala" attrs={{ label: true }}>
            <LabeledInput
              name="kennitala"
              value={consent.kennitala}
              type="number"
              onChange={(e: any) =>
                this.handleConsentFormChange(e)
              }></LabeledInput>
          </Localized>
          {message ? (
            <div>{message}</div>
          ) : (
            <Localized>
              <Localized id="consent-form-check">
                <Button outline onClick={() => this.checkKennitala()} />
              </Localized>
            </Localized>
          )}
        </div>
        <div>
          {consentNeeded && !emailSent && (
            <div>
              <div className="info">
                Vinsamlegast sláðu inn netfang forsjáraðila.
              </div>
              <div className="form-fields">
                <Localized id="consent-form-email" attrs={{ label: true }}>
                  <LabeledInput
                    name="email"
                    value={consent.email}
                    type="email"
                    pattern=".+@.+\..+"
                    onChange={(e: any) =>
                      this.handleConsentFormChange(e)
                    }></LabeledInput>
                </Localized>
                {emailMessage ? (
                  <div>{emailMessage}</div>
                ) : (
                  <Localized>
                    <Localized id="consent-form-submit">
                      <Button outline onClick={() => this.sendEmail()} />
                    </Localized>
                  </Localized>
                )}
              </div>
            </div>
          )}
        </div>
        <div className={`demographic-info ${showWhyInfo ? 'expanded' : ''}`}>
          <button type="button" onClick={() => this.setShowWhyInfo()}>
            <Localized id="why-consent">
              <span />
            </Localized>

            <DownIcon />
          </button>
          <Localized
            id="why-demographic-explanation"
            termsLink={<LocaleLink to={URLS.TERMS} blank />}
            privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
            <div className="explanation" />
          </Localized>
        </div>
      </div>
    );
  }
}
