import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { DAILY_GOAL } from '../../../constants';
import { useAccount, useAPI } from '../../../hooks/store-hooks';
import URLS from '../../../urls';
import CustomGoalLock from '../../custom-goal-lock';
import { LocaleLink } from '../../locale-helpers';
import { CheckIcon, MicIcon, PlayOutlineIcon } from '../../ui/icons';
import { Button, LinkButton, TextButton } from '../../ui/ui';
import { SET_COUNT } from './contribution';

import './success.css';

const COUNT_UP_MS = 500; // should be kept in sync with .contribution-success .done transition duration

const GoalPercentage = ({
  current,
  final,
}: {
  current: number;
  final: number;
}) => (
  <span className="goal-percentage">
    <span className="final">{final}%</span>
    <span className="current">{current}%</span>
  </span>
);

export default function Success({
  onReset,
  type,
}: {
  type: 'speak' | 'listen';
  onReset: () => any;
}) {
  const api = useAPI();
  const account = useAccount();

  const hasAccount = Boolean(account);
  const customGoal = hasAccount && account.customGoal;
  const goalValue = DAILY_GOAL[type];

  const killAnimation = useRef(false);
  const startedAt = useRef(null);
  const [contributionCount, setContributionCount] = useState(null);
  const [currentCount, setCurrentCount] = useState(null);

  function countUp(time: number) {
    if (killAnimation.current) return;
    if (!startedAt.current) startedAt.current = time;
    const newCount = Math.min(
      Math.ceil((contributionCount * (time - startedAt.current)) / COUNT_UP_MS),
      contributionCount
    );
    setCurrentCount(newCount);

    if (newCount < contributionCount) {
      requestAnimationFrame(countUp);
    }
  }

  useEffect(() => {
    (type === 'speak'
      ? api.fetchDailyClipsCount()
      : api.fetchDailyVotesCount()
    ).then(value => {
      setContributionCount(value + SET_COUNT);
    });
    return () => {
      killAnimation.current = true;
    };
  }, []);

  useEffect(() => {
    if (contributionCount != null) {
      countUp(performance.now());
    }
  }, [contributionCount]);

  const finalPercentage = Math.ceil(
    (100 * (contributionCount || 0)) / goalValue
  );

  const ContributeMoreButton = (props: { children: React.ReactNode }) =>
    hasAccount ? (
      <Button
        className="contribute-more-button"
        rounded
        onClick={onReset}
        {...props}
      />
    ) : (
      <TextButton
        className="contribute-more-button secondary"
        onClick={onReset}
        {...props}
      />
    );

  const goalPercentage = (
    <GoalPercentage
      current={Math.ceil(
        (100 * (currentCount === null ? 0 : currentCount)) / goalValue
      )}
      final={finalPercentage}
    />
  );

  return (
    <div className="contribution-success">
      <div className="counter done">
        <CheckIcon />
        <Localized
          id="clips-with-count"
          bold={<b />}
          $count={SET_COUNT + '/' + SET_COUNT}>
          <span className="text" />
        </Localized>
      </div>

      <Localized
        id={type === 'speak' ? 'goal-help-recording' : 'goal-help-validation'}
        goalPercentage={goalPercentage}
        $goalValue={goalValue}>
        <h1 />
      </Localized>

      <div className="progress">
        <div
          className="done"
          style={{
            width: Math.min(finalPercentage, 100) + '%',
          }}
        />
      </div>

      {type == 'listen' ? (
        <div className="info-card">
          <Localized id="speak-paragraph">
            <p />
          </Localized>
          <Localized id="speak-subtitle">
            <LinkButton rounded href="/tala" />
          </Localized>
        </div>
      ) : (
        <div className="info-card">
          <Localized id="listen-paragraph">
            <p />
          </Localized>
          <Localized id="listen-subtitle">
            <LinkButton rounded href="/hlusta" />
          </Localized>
        </div>
      )}

      <ContributeMoreButton>
        {type === 'speak' ? <MicIcon /> : <PlayOutlineIcon />}
        <Localized id="contribute-more" $count={SET_COUNT}>
          <span />
        </Localized>
      </ContributeMoreButton>

      {hasAccount && (
        <Localized id="edit-profile">
          <LocaleLink className="secondary" to={URLS.PROFILE_INFO} />
        </Localized>
      )}
    </div>
  );
}
