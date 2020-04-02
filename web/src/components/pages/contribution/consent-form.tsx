import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Button, LabeledInput, StyledLink } from '../../ui/ui';
import { ModalButtons } from '../../modal/modal';
import API from '../../../services/api';
import './consent-form.css';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { DownIcon } from '../../ui/icons';
import { Kennitala, KennitalaType } from './kennitala-validator';

interface ConsentInfo {
  email: string;
  kennitala: string;
}

interface State {
  consent: ConsentInfo;
  submittedConsent: ConsentInfo;
  consentNeeded: boolean;
  message: string;
  showWhyInfo: boolean;
  emailMessage: string;
  emailSent: boolean;
}

interface Props {
  api: API;
  setAge: (age: string) => void;
  setConsentGranted: () => void;
}

export default class ConsentForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  state: State = {
    consent: {
      email: '',
      kennitala: '',
    },
    submittedConsent: {
      email: '',
      kennitala: '',
    },
    consentNeeded: true,
    message: '',
    showWhyInfo: false,
    emailMessage: '',
    emailSent: false,
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

  private validateKennitala = async () => {
    const { kennitala } = this.state.consent;

    if (kennitala == null) {
      return false;
    }

    const valid: KennitalaType = Kennitala.Validate(kennitala);
    if (valid != KennitalaType.Individual) {
      console.log('Invalid kennitala');
      this.setState({
        message: 'Ógild kennitala.',
      });
      return false;
    }
    return true;
  };

  private getAge = (kennitala: string): number => {
    const day = parseInt(kennitala[0] + kennitala[1]);
    const month = parseInt(kennitala[2] + kennitala[3]);
    const year = parseInt('20' + kennitala[4] + kennitala[5]);
    const birthday = new Date(year, month - 1, day, 0, 0, 0, 0);
    const diffMs = Date.now() - birthday.getTime();
    const ageDate = new Date(diffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);
    return age;
  };

  private checkKennitala = async () => {
    const { api } = this.props;
    const allowed = await api.checkKennitala(this.state.consent.kennitala);
    if (allowed) {
      this.setState({
        message: 'Kennitalan hefur verið samþykkt.',
      });
      this.submitChildAge();
      setTimeout(this.props.setConsentGranted, 1000);
      return;
    } else {
      this.setState({
        message: 'Kennitalan hefur ekki verið samþykkt.',
      });
      return;
    }
  };

  private validateEmail = () => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.consent.email.toLowerCase());
  };

  private sendEmail = async () => {
    if (!this.validateEmail()) {
      this.setState({
        message: 'Ógilt tölvupóstfang.',
      });
      return;
    }
    const { kennitala, email } = this.state.consent;
    this.setState({
      message: 'Sendi tölvupóst...',
    });
    const sent = await this.props.api.sendConsentEmail(kennitala, email);
    if (sent) {
      this.setState({
        message: 'Tölvupóstur sendur.',
      });
      setTimeout(() => {
        this.setState({
          emailSent: true,
          message: '',
          submittedConsent: {
            email: email,
            kennitala: kennitala,
          },
        });
      }, 1000);
    } else {
      this.setState({
        message: 'Villa í sendingu tölvupósts.',
      });
    }
  };

  private submitChildAge = () => {
    const { consent, submittedConsent } = this.state;
    let childAge: string;
    if (submittedConsent.kennitala) {
      childAge = this.getAge(submittedConsent.kennitala).toString();
    } else {
      childAge = this.getAge(consent.kennitala).toString();
    }
    console.log(childAge);
    this.props.setAge(childAge);
  };

  private submit = async () => {
    const valid = await this.validateKennitala();
    if (valid) {
      const { api } = this.props;
      const allowed = await api.checkKennitala(this.state.consent.kennitala);
      if (allowed) {
        this.setState({
          message: 'Þessi kennitala hefur verið samþykkt.',
        });
        this.submitChildAge();
        setTimeout(this.props.setConsentGranted, 500);
        return;
      }
      this.sendEmail();
    }
  };

  render() {
    const {
      consent,
      submittedConsent,
      consentNeeded,
      message,
      showWhyInfo,
      emailSent,
    } = this.state;

    return (
      <div>
        {!emailSent ? (
          <div className="info-consent">
            <div className="info">
              Börn og ungmenni verða að fá samþykki foreldris/forsjáraðila til
              þess að taka þátt í verkefninu Samrómur. Vinsamlegast sláðu inn
              kennitölu og netfang foreldris/forsjáraðila hér að neðan.
            </div>
          </div>
        ) : (
          <div className="info-consent">
            <div className="info">
              <Localized
                id="consent-email-sent"
                bold={<b />}
                $email={submittedConsent.email}
                $kennitala={submittedConsent.kennitala}
                listenLink={<LocaleLink to={URLS.LISTEN} blank />}>
                <span />
              </Localized>
            </div>
          </div>
        )}
        <div className="form-fields">
          <Localized id="consent-form-kennitala" attrs={{ label: true }}>
            <LabeledInput
              name="kennitala"
              className="kennitala"
              value={consent.kennitala}
              type="number"
              onChange={(e: any) =>
                this.handleConsentFormChange(e)
              }></LabeledInput>
          </Localized>
          {!emailSent ? (
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
          ) : (
            <Localized>
              <Localized id="consent-form-check">
                <Button outline onClick={() => this.checkKennitala()} />
              </Localized>
            </Localized>
          )}
        </div>

        {message && <div className="error-message">{message}</div>}
        {consentNeeded && !emailSent && (
          <ModalButtons>
            <Localized>
              <Localized id="consent-form-submit">
                <Button outline rounded onClick={() => this.submit()} />
              </Localized>
            </Localized>
          </ModalButtons>
        )}
        <div className={`demographic-info ${showWhyInfo ? 'expanded' : ''}`}>
          <button type="button" onClick={() => this.setShowWhyInfo()}>
            <Localized id="why-consent">
              <span />
            </Localized>

            <DownIcon />
          </button>
          <Localized
            id="why-consent-explanation"
            privacyRightsLink={
              <StyledLink
                href="https://www.stjornartidindi.is/Advert.aspx?RecordID=55860204-b174-41c8-bf50-7f36e88eb051"
                blank
              />
            }
            termsLink={<LocaleLink to={URLS.TERMS} blank />}
            privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
            <div className="explanation" />
          </Localized>
        </div>
      </div>
    );
  }
}
