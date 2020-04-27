import * as React from 'react';
import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import ConsentForm from './consent-form';
import CompetitionForm from './competition-form';
import { Button, LabeledSelect, LabeledCheckbox } from '../../ui/ui';
import { LocaleLink } from '../../locale-helpers';
import URLS from '../../../urls';
import { LANGUAGES, AGES, SEXES, DemoInfo } from '../../../stores/demographics';
import { CompetitionInfo, Institution } from '../../../stores/competition';
import Modal, { ModalButtons } from '../../modal/modal';
import { DownIcon } from '../../ui/icons';

import './count-modal.css';
import './speak/speak.css';
import './scrollable-modal.css';

const DEFAULT_LANGUAGE = 'islenska';
const childAges = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
];
const Options = withLocalization(
  ({
    children,
    getString,
  }: {
    children: { [key: string]: string };
  } & LocalizationProps) => (
    <React.Fragment>
      {Object.entries(children)
        .filter(value => !(value[0] in childAges))
        .map(([key, value]) => (
          <option key={key} value={key}>
            {getString(key, null, value)}
          </option>
        ))}
    </React.Fragment>
  )
);

interface State {
  demographic: DemoInfo;
  childAge: string;
  isChild: boolean;
  consentGranted: boolean;
  showLanguageSelect: boolean;
  showDemographicInfo: boolean;
}

interface Props {
  api: any;
  demographic: DemoInfo;
  competition: CompetitionInfo;
  institutions: Institution[];
  submitDemographic: (
    demographic: DemoInfo,
    competition: CompetitionInfo
  ) => void;
  setShowDemographicModal: () => void;
}

export default class DemographicModal extends React.Component<Props, State> {
  private competitionRef: any;
  constructor(props: Props) {
    super(props);
    this.competitionRef = React.createRef();
  }

  state: State = {
    demographic: {
      sex: '',
      age: '',
      native_language: '',
    },
    childAge: '',
    isChild: false,
    consentGranted: false,
    showLanguageSelect: false,
    showDemographicInfo: false,
  };

  componentDidMount = () => {
    // Maybe put undir 18 when client swaps users
    this.setState({
      demographic: this.props.demographic,
    });
  };

  private handleChangeFor = (e: any) => {
    if (e.target.name == 'age') {
      if (e.target.value == 'barn') {
        this.setState({
          isChild: true,
        });
      } else {
        this.setState({
          isChild: false,
        });
      }
    }

    this.setState({
      demographic: {
        ...this.state.demographic,
        [e.target.name]: e.target.value,
      },
    });
  };

  private setShowDemographicInfo() {
    this.setState({
      showDemographicInfo: !this.state.showDemographicInfo,
    });
  }

  private setConsentGranted = () => {
    this.setState({
      consentGranted: true,
    });
  };

  private toggleNativeIcelandic = () => {
    if (this.state.showLanguageSelect) {
      this.setState({
        demographic: {
          ...this.state.demographic,
          native_language: DEFAULT_LANGUAGE,
        },
        showLanguageSelect: false,
      });
    } else {
      this.setState({
        demographic: {
          ...this.state.demographic,
          native_language: '',
        },
        showLanguageSelect: true,
      });
    }
  };

  private submit = () => {
    const { demographic, isChild, childAge } = this.state;
    const competitionState = this.competitionRef.current.state;
    const competition = {
      institution: competitionState.selectedInstitution,
      division: competitionState.selectedDivision,
    };

    if (isChild && childAge) {
      const newDemographic = {
        ...demographic,
        age: childAge,
      };
      this.props.submitDemographic(newDemographic, competition);
    } else {
      this.props.submitDemographic(demographic, competition);
    }
  };

  private setAge = (age: string) => {
    this.setState({
      childAge: age,
    });
  };

  render() {
    const {
      demographic,
      isChild,
      consentGranted,
      showLanguageSelect,
      showDemographicInfo,
    } = this.state;
    return (
      <Modal innerClassName="scrollable-modal" onRequestClose={this.submit}>
        <Localized id="demographic-form-title" className="form-title">
          <h1 className="title" />
        </Localized>
        <div className="form-fields">
          <Localized id="demographic-form-age" attrs={{ label: true }}>
            <LabeledSelect
              name="age"
              value={demographic.age}
              onChange={(e: any) => this.handleChangeFor(e)}>
              <Options>{AGES}</Options>
            </LabeledSelect>
          </Localized>
          <div
            className={
              this.state.isChild && !this.state.consentGranted
                ? 'gender-child'
                : ''
            }>
            <Localized id="demographic-form-gender" attrs={{ label: true }}>
              <LabeledSelect
                name="sex"
                value={demographic.sex}
                onChange={(e: any) => this.handleChangeFor(e)}>
                <Options>{SEXES}</Options>
              </LabeledSelect>
            </Localized>
          </div>
        </div>
        {isChild && !consentGranted && (
          <ConsentForm
            setConsentGranted={this.setConsentGranted}
            setAge={(age: string) => this.setAge(age)}
            api={this.props.api}
          />
        )}
        {(!isChild || consentGranted) && (
          <div className="form-fields">
            <LabeledCheckbox
              checked={!showLanguageSelect}
              label={
                <Localized id="demographic-form-other-native-language">
                  <span />
                </Localized>
              }
              onChange={(e: any) => this.toggleNativeIcelandic()}
            />
            {showLanguageSelect && (
              <Localized
                id="demographic-form-native-language"
                attrs={{ label: true }}>
                <LabeledSelect
                  name="native_language"
                  value={demographic.native_language}
                  onChange={(e: any) => this.handleChangeFor(e)}>
                  <Options>{LANGUAGES}</Options>
                </LabeledSelect>
              </Localized>
            )}
          </div>
        )}
        {(!isChild || consentGranted) && (
          <div
            className={`demographic-info ${
              showDemographicInfo ? 'expanded' : ''
            }`}>
            <button type="button" onClick={() => this.setShowDemographicInfo()}>
              <Localized
                id="why-demographic"
                termsLink={<LocaleLink to={URLS.TERMS} blank />}
                privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
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
        )}
        {(!isChild || consentGranted) && (
          <div>
            {this.props.institutions && (
              <CompetitionForm
                ref={this.competitionRef}
                api={this.props.api}
                competition={this.props.competition}
                institutions={this.props.institutions}
              />
            )}
            <ModalButtons>
              <Localized>
                <Localized id="demographic-form-submit">
                  <Button outline rounded onClick={this.submit} />
                </Localized>
              </Localized>
            </ModalButtons>
          </div>
        )}
      </Modal>
    );
  }
}
