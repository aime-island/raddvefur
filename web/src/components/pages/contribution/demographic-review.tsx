import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import { Button, Radio } from '../../ui/ui';
import Modal, { ModalButtons } from '../../modal/modal';
import { InfoIcon } from '../../ui/icons';
import { LANGUAGES, AGES, SEXES, DemoInfo } from '../../../stores/demographics';
import { CompetitionInfo, Institution } from '../../../stores/competition';

import './count-modal.css';
import './demographic-review.css';
import './scrollable-modal.css';

interface Props {
  competition: CompetitionInfo;
  institutions: Institution[];
  demographic: DemoInfo;
  setShowDemographicModal: () => void;
  setShowDemoReviewModal: () => void;
}

export default class DemographicReview extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private editDemoGraphic = () => {
    this.props.setShowDemographicModal();
    setTimeout(this.props.setShowDemoReviewModal, 1000);
  };

  render() {
    const { demographic, competition, institutions } = this.props;
    let institution, division;
    if (competition) {
      institution = institutions.find(
        item => item.code == competition.institution
      );
      if (institution) {
        division = institution.divisions.find(
          item => item.code == competition.division
        );
      }
    }

    return (
      <Modal
        innerClassName="scrollable-modal"
        onRequestClose={this.props.setShowDemoReviewModal}>
        <Localized id="demographic-review-title" className="form-title">
          <h1 className="title" />
        </Localized>

        <div className="cookie-modal">
          <div className="review-flex">
            <div className="toggle-with-info">
              <div className="review-info">
                <InfoIcon />
                <div className="demographic-review">
                  <div className="demo-item">
                    Aldur: <span>{AGES[demographic.age]}</span>
                  </div>
                  <div className="demo-item">
                    Kyn: <span>{SEXES[demographic.sex]}</span>
                  </div>
                  <div className="demo-item">
                    Móðurmál:{' '}
                    <span>{LANGUAGES[demographic.native_language]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="toggle-with-info">
              <div className="review-info">
                <div className="demographic-review">
                  <div className="demo-item">
                    Stofnun:{' '}
                    <span>{institution ? institution.name || '' : ''}</span>
                  </div>
                  <div className="demo-item">
                    Deild: <span>{division ? division.name || '' : ''}</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
          <ModalButtons>
            <Button
              rounded
              outline
              className="btn-grn"
              onClick={this.editDemoGraphic}>
              Breyta
            </Button>
            <Button
              rounded
              outline
              className="btn-grn"
              onClick={this.props.setShowDemoReviewModal}>
              Áfram
            </Button>
          </ModalButtons>
        </div>
      </Modal>
    );
  }
}
