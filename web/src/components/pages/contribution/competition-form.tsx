import * as React from 'react';
import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import { Button, LabeledSelect, StyledLink } from '../../ui/ui';
import { ModalButtons } from '../../modal/modal';
import API from '../../../services/api';
import './consent-form.css';
import URLS from '../../../urls';
import { LocaleLink } from '../../locale-helpers';
import { DownIcon } from '../../ui/icons';
import {
  CompetitionInfo,
  Institution,
  Division,
} from '../../../stores/competition';

const Options = withLocalization(
  ({
    children,
    getString,
  }: {
    children: { [key: string]: string };
  } & LocalizationProps) => (
    <React.Fragment>
      {Object.entries(children).map(([key, value]) => (
        <option key={key} value={key}>
          {getString(key, null, value)}
        </option>
      ))}
    </React.Fragment>
  )
);

interface State {
  selectedInstitution: string;
  selectedDivision: string;
  showCompetitionInfo: boolean;
  divisions: Division[];
}

interface Props {
  api: API;
  institutions: Institution[];
  competition: CompetitionInfo;
}

export default class CompetitionForm extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  state: State = {
    selectedInstitution: '',
    selectedDivision: '',
    divisions: [],
    showCompetitionInfo: false,
  };

  componentDidMount = async () => {
    if (this.props.competition) {
      const institution = this.props.institutions.find(
        item => item.code == this.props.competition.institution
      );
      if (institution) {
        this.setState({
          divisions: institution.divisions,
        });
      }
      this.setState({
        selectedInstitution: this.props.competition.institution,
        selectedDivision: this.props.competition.division,
      });
    }
  };

  private handleChangeFor = (e: any) => {
    const name = e.target.name;
    if (name == 'institution') {
      const institution = this.props.institutions.find(
        item => item.code == e.target.value
      );
      if (!institution) {
        this.setState({
          selectedInstitution: '',
          selectedDivision: '',
          divisions: [],
        });
      } else {
        this.setState({
          selectedInstitution: institution.code,
          divisions: institution.divisions,
          selectedDivision: '',
        });
      }
    } else if (name == 'division') {
      const division = this.state.divisions.find(
        item => item.code == e.target.value
      );
      if (!division) {
        this.setState({
          selectedDivision: '',
        });
      } else {
        this.setState({
          selectedDivision: division.code,
        });
      }
    }
  };

  private setShowCompetitionInfo = () => {
    this.setState({
      showCompetitionInfo: !this.state.showCompetitionInfo,
    });
  };

  private toOptions = (items: Institution[] | Division[]) => {
    let obj: { [key: string]: string } = { '': '' };
    items.forEach((item: Institution | Division) => {
      obj[item.code] = item.name;
    });
    return obj;
  };

  render() {
    const {
      selectedInstitution,
      selectedDivision,
      showCompetitionInfo,
    } = this.state;
    const institutions = this.toOptions(this.props.institutions);
    const divisions = this.toOptions(this.state.divisions);
    return (
      <div>
        {/* <Localized id="competition-form-title" className="form-title">
          <h1 className="title" />
        </Localized>
        <div className="form-fields">
          <Localized id="competition-form-institution" attrs={{ label: true }}>
            <LabeledSelect
              name="institution"
              value={selectedInstitution}
              onChange={(e: any) => this.handleChangeFor(e)}>
              <Options>{institutions}</Options>
            </LabeledSelect>
          </Localized> */}
        {/* <Localized id="competition-form-division" attrs={{ label: true }}>
            <LabeledSelect
              name="division"
              value={selectedDivision}
              onChange={(e: any) => this.handleChangeFor(e)}>
              <Options>{divisions}</Options>
            </LabeledSelect>
          </Localized> */}
        {/* </div>
        <div
          className={`demographic-info ${
            showCompetitionInfo ? 'expanded' : ''
          }`}>
          <button type="button" onClick={() => this.setShowCompetitionInfo()}>
            <Localized id="why-competition">
              <span />
            </Localized>

            <DownIcon />
          </button>
          <Localized
            id="why-competition-explanation"
            termsLink={<LocaleLink to={URLS.TERMS} blank />}
            privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
            <div className="explanation" />
          </Localized>
        </div> */}
      </div>
    );
  }
}
