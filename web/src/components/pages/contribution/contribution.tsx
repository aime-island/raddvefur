import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
const { Tooltip } = require('react-tippy');
import { Locale } from '../../../stores/locale';
import StateTree from '../../../stores/tree';
import { User } from '../../../stores/user';
import { trackListening, trackRecording } from '../../../services/tracker';
import URLS from '../../../urls';
import { LocaleLink, LocaleNavLink } from '../../locale-helpers';
import Modal from '../../modal/modal';
import {
  ArrowLeft,
  CheckIcon,
  KeyboardIcon,
  ShareIcon,
  SkipIcon,
} from '../../ui/icons';
import { Button } from '../../ui/ui';
import { PrimaryButton } from '../../primary-buttons/primary-buttons';
import ShareModal from '../../share-modal/share-modal';
import Success from './success';
import Wave from './wave';

import './contribution.css';
import { LANGUAGES, AGES, SEXES } from '../../../stores/demographics';
import { Institution } from '../../../stores/competition';
import pill from './pill';

export interface ContributionPillProps {
  isOpen: boolean;
  key: any;
  num: number;
  onClick: () => any;
  onShare: () => any;
  style?: any;
}

interface PropsFromState {
  locale: Locale.State;
  user: User.State;
}

interface Props extends LocalizationProps, PropsFromState {
  activeIndex: number;
  errorContent?: any;
  extraButton?: React.ReactNode;
  institutions?: Institution[];
  instruction: (props: {
    $actionType: string;
    children: any;
  }) => React.ReactNode;
  isFirstSubmit?: boolean;
  isPlaying: boolean;
  isSubmitted: boolean;
  onReset: () => any;
  onSkip: () => any;
  onSubmit?: () => any;
  primaryButtons: React.ReactNode;
  pills: ((props: ContributionPillProps) => React.ReactNode)[];
  speakSetCount?: number;
  listenSetCount?: number;
  sentences: string[];
  shortcuts: {
    key: string;
    label: string;
    action: () => any;
  }[];
  type: 'speak' | 'listen';
  showDemographicModal?: boolean;
  setShowDemographicModal?: () => any;
}

interface State {
  selectedPill: number;
  showShareModal: boolean;
  showShortcutsModal: boolean;
  speakSetCount: number;
  listenSetCount: number;
}

class ContributionPage extends React.Component<Props, State> {
  static defaultProps = {
    isFirstSubmit: false,
  };

  state: State = {
    selectedPill: null,
    showShareModal: false,
    showShortcutsModal: false,
    speakSetCount: 5,
    listenSetCount: 5,
  };

  private canvasRef: { current: HTMLCanvasElement | null } = React.createRef();
  private wave: Wave;

  componentDidMount() {
    this.startWaving();
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate() {
    this.startWaving();

    const { isPlaying, isSubmitted, onReset, user } = this.props;

    if (this.wave) {
      isPlaying ? this.wave.play() : this.wave.idle();
    }

    if (isSubmitted && user.account && user.account.skip_submission_feedback) {
      onReset();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.wave) this.wave.idle();
  }

  private get isLoaded() {
    return this.props.sentences.length > 0;
  }

  private get isDone() {
    //const count = this.props.type == 'speak' ? this.props.speakSetCount : this.props.listenSetCount;
    return this.isLoaded && this.props.activeIndex == -1;
  }

  private get shortcuts() {
    const { onSkip, shortcuts } = this.props;
    return shortcuts.concat({
      key: 'shortcut-skip',
      label: 'skip',
      action: onSkip,
    });
  }

  private startWaving = () => {
    const canvas = this.canvasRef.current;

    if (this.wave) {
      if (!canvas) {
        this.wave.idle();
        this.wave = null;
      }
      return;
    }

    if (canvas) {
      this.wave = new Wave(canvas);
    }
  };

  private selectPill(i: number) {
    this.setState({ selectedPill: i });
  }

  private toggleShareModal = () =>
    this.setState({ showShareModal: !this.state.showShareModal });

  private toggleShortcutsModal = () => {
    const showShortcutsModal = !this.state.showShortcutsModal;
    if (showShortcutsModal) {
      const { locale, type } = this.props;
      (type == 'listen' ? trackListening : (trackRecording as any))(
        'view-shortcuts',
        locale
      );
    }
    return this.setState({ showShortcutsModal });
  };

  private handleKeyDown = (event: any) => {
    if (this.props.showDemographicModal) {
      return;
    }
    const {
      getString,
      isSubmitted,
      locale,
      onReset,
      onSubmit,
      type,
    } = this.props;
    if (event.ctrlKey || event.altKey || event.shiftKey) return;

    const isEnter = event.key === 'Enter';
    if (isSubmitted && isEnter) {
      onReset();
      return;
    }
    if (this.isDone) {
      if (isEnter && onSubmit) onSubmit();
      return;
    }

    const shortcut = this.shortcuts.find(
      ({ key }) => getString(key).toLowerCase() === event.key
    );
    if (!shortcut) return;

    shortcut.action();
    ((type === 'listen' ? trackListening : trackRecording) as any)(
      'shortcut',
      locale
    );
    event.preventDefault();
  };

  private handleSkip = () => {
    const { locale, onSkip, type } = this.props;
    ((type === 'listen' ? trackListening : trackRecording) as any)(
      'skip',
      locale
    );
    onSkip();
  };

  render() {
    const {
      errorContent,
      getString,
      isSubmitted,
      type,
      user,
      setShowDemographicModal,
    } = this.props;
    const { showShareModal, showShortcutsModal } = this.state;

    return (
      <div
        className="contribution-wrapper"
        onClick={() => this.selectPill(null)}>
        {showShareModal && (
          <ShareModal onRequestClose={this.toggleShareModal} />
        )}
        {showShortcutsModal && (
          <Modal
            innerClassName="shortcuts-modal"
            onRequestClose={this.toggleShortcutsModal}>
            <Localized id="shortcuts">
              <h1 />
            </Localized>
            <div className="shortcuts">
              {this.shortcuts.map(({ key, label }) => (
                <div key={key} className="shortcut">
                  <kbd>{getString(key).toUpperCase()}</kbd>
                  <div className="label">{getString(label)}</div>
                </div>
              ))}
            </div>
          </Modal>
        )}
        <div
          className={[
            'contribution',
            type,
            this.isDone ? 'submittable' : '',
          ].join(' ')}>
          <div className="top">
            <LocaleLink
              to={user.account ? URLS.DASHBOARD : URLS.ROOT}
              className="back">
              <ArrowLeft />
            </LocaleLink>

            <div className="links">
              <Localized id="speak">
                <LocaleNavLink to={URLS.SPEAK} />
              </Localized>
              <Localized id="listen">
                <LocaleNavLink to={URLS.LISTEN} />
              </Localized>
            </div>

            {this.isLoaded && !errorContent ? (
              <div className={'counter ' + (isSubmitted ? 'done' : '')}>
                {isSubmitted && <CheckIcon />}
                <Localized
                  id="clips-with-count"
                  bold={<b />}
                  $count={this.renderClipCount()}>
                  <span className="text" />
                </Localized>
              </div>
            ) : (
              <div />
            )}
            {isSubmitted && (
              <button className="open-share" onClick={this.toggleShareModal}>
                <ShareIcon />
              </button>
            )}
          </div>

          {this.renderContent()}
        </div>
      </div>
    );
  }

  renderClipCount() {
    const {
      activeIndex,
      isSubmitted,
      speakSetCount,
      listenSetCount,
    } = this.props;
    return this.props.type == 'speak'
      ? (isSubmitted ? speakSetCount : activeIndex + 1 || speakSetCount) +
          '/' +
          speakSetCount
      : (isSubmitted ? listenSetCount : activeIndex + 1 || listenSetCount) +
          '/' +
          listenSetCount;
  }

  renderContent() {
    const {
      activeIndex,
      errorContent,
      extraButton,
      getString,
      institutions,
      instruction,
      isFirstSubmit,
      isSubmitted,
      onReset,
      onSkip,
      onSubmit,
      pills,
      primaryButtons,
      sentences,
      type,
      speakSetCount,
      listenSetCount,
      user,
      setShowDemographicModal,
    } = this.props;
    const { selectedPill } = this.state;
    let fivePills;
    if (activeIndex > 4) {
      fivePills = pills.slice(activeIndex - 4, activeIndex + 1);
    } else if (activeIndex == -1) {
      fivePills =
        type == 'speak'
          ? pills.slice(speakSetCount - 5, speakSetCount)
          : pills.slice(listenSetCount - 5, listenSetCount);
    } else {
      fivePills = pills.slice(0, 5);
    }
    let institutionName, divisionName;
    if (institutions && user.competitionInfo) {
      const institution = institutions.find(
        item => item.code == user.competitionInfo.institution
      );
      if (institution) {
        institutionName = institution.name;
        const division = institution.divisions.find(
          item => item.code == user.competitionInfo.division
        );
        if (division) {
          divisionName = division.name;
        }
      }
    }
    return isSubmitted ? (
      <Success
        onReset={onReset}
        type={type}
        listenSetCount={listenSetCount}
        speakSetCount={speakSetCount}
      />
    ) : (
      errorContent ||
        (this.isLoaded && (
          <React.Fragment>
            <div className="cards-and-pills">
              <div />
              <div className="cards-and-instruction">
                <div className="cards">
                  {sentences.map((sentence, i) => {
                    const activeSentenceIndex = this.isDone
                      ? type == 'speak'
                        ? speakSetCount - 1
                        : listenSetCount - 1
                      : activeIndex;
                    const isActive = i === activeSentenceIndex;
                    return (
                      <div
                        key={sentence}
                        className={
                          'card card-dimensions ' + (isActive ? '' : 'inactive')
                        }
                        style={{
                          transform: [
                            `scale(${isActive ? 1 : 0.9})`,
                            `translateX(${(document.dir == 'rtl' ? -1 : 1) *
                              (i - activeSentenceIndex) *
                              -130}%)`,
                          ].join(' '),
                          opacity: i < activeSentenceIndex ? 0 : 1,
                        }}>
                        <div style={{ margin: 'auto', width: '100%' }}>
                          {sentence}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {instruction({
                  $actionType: getString('action-click'),
                  children: <div className="instruction hidden-sm-down" />,
                }) || <div className="instruction hidden-sm-down" />}
              </div>
              <div className="pills">
                <div className="inner">
                  {!errorContent && (
                    <div className="counter">
                      <Localized
                        id="clips-with-count"
                        bold={<b />}
                        $count={this.renderClipCount()}>
                        <span className="text" />
                      </Localized>
                    </div>
                  )}
                  {this.isDone && (
                    <div className="review-instructions">
                      <Localized id="review-instruction">
                        <span />
                      </Localized>
                    </div>
                  )}
                  {fivePills.map((pill, i) =>
                    pill({
                      isOpen: this.isDone || selectedPill === i,
                      key: i,
                      num:
                        i +
                        1 +
                        (activeIndex > 4
                          ? activeIndex - 4
                          : activeIndex == -1
                          ? type == 'speak'
                            ? speakSetCount - 5
                            : listenSetCount - 5
                          : 0),
                      onClick: () => this.selectPill(i),
                      onShare: this.toggleShareModal,
                      style:
                        selectedPill !== null &&
                        Math.abs(
                          Math.min(
                            Math.max(selectedPill, 1),
                            pills.length - 2
                          ) - i
                        ) > 1
                          ? { display: 'none' }
                          : {},
                    })
                  )}
                </div>
              </div>
              {this.isDone && (
                <div className="review-demo">
                  <div className="inner">
                    <div className="review-demo-titles">
                      <Localized id="review-demo-title">
                        <span />
                      </Localized>
                    </div>
                    <div className="my-demo">
                      <Localized
                        id="review-age"
                        bold={<b />}
                        $age={AGES[user.demographicInfo.age] || ''}>
                        <span className="text" />
                      </Localized>
                      <Localized
                        id="review-gender"
                        bold={<b />}
                        $sex={SEXES[user.demographicInfo.sex] || ''}>
                        <span className="text" />
                      </Localized>
                      <Localized
                        id="review-native-language"
                        bold={<b />}
                        $native_language={
                          LANGUAGES[user.demographicInfo.native_language] || ''
                        }>
                        <span className="text" />
                      </Localized>
                      {/* <Localized
                        id="review-institution"
                        bold={<b />}
                        $institution={institutionName || ''}>
                        <span className="text" />
                      </Localized> */}
                      {/*                       <Localized
                        id="review-division"
                        bold={<b />}
                        $division={divisionName || ''}>
                        <span className="text" />
                      </Localized> */}
                    </div>
                    <Localized id="change-demo">
                      <Button
                        className="submit-demo"
                        disabled={!this.isDone}
                        onClick={setShowDemographicModal}
                      />
                    </Localized>
                  </div>
                </div>
              )}
            </div>

            {instruction({
              $actionType: getString('action-tap'),
              children: <div className="instruction hidden-md-up" />,
            }) || <div className="instruction hidden-md-up" />}

            <div className="primary-buttons">
              <canvas ref={this.canvasRef} />
              {primaryButtons}
            </div>
            <div className="buttons">
              <div>
                <Button
                  rounded
                  outline
                  className="hidden-sm-down"
                  onClick={this.toggleShortcutsModal}>
                  <KeyboardIcon />
                  <Localized id="shortcuts">
                    <span />
                  </Localized>
                </Button>
                <div className="extra-button">{extraButton}</div>
              </div>
              <div>
                <Button
                  rounded
                  outline
                  className="skip"
                  disabled={!this.isLoaded}
                  onClick={onSkip}>
                  <Localized id="skip">
                    <span />
                  </Localized>{' '}
                  <SkipIcon />
                </Button>
                {onSubmit && (
                  <Tooltip
                    arrow
                    disabled={!this.isDone}
                    open={isFirstSubmit || undefined}
                    title={getString('record-submit-tooltip', {
                      actionType: getString('action-tap'),
                    })}>
                    <Localized id="submit-form-action">
                      <PrimaryButton
                        className="submit"
                        disabled={!this.isDone && activeIndex < 1}
                        onClick={onSubmit}
                        type="submit"
                      />
                    </Localized>
                  </Tooltip>
                )}
              </div>
            </div>
          </React.Fragment>
        ))
    );
  }
}

export default connect<PropsFromState>(({ locale, user }: StateTree) => ({
  locale,
  user,
}))(withLocalization(ContributionPage));
