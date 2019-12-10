import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { useState } from 'react';
import { useAPI } from '../../../hooks/store-hooks';
import { trackGlobal } from '../../../services/tracker';
import URLS from '../../../urls';
import CustomGoalLock from '../../custom-goal-lock';
import {
  LocaleLink,
  LocalizedGetAttribute,
  useLocale,
} from '../../locale-helpers';
import { CautionIcon, CheckIcon, OldPlayIcon } from '../../ui/icons';
import { Button, LabeledInput, LabeledCheckbox } from '../../ui/ui';

import './subscribe.css';

export default function SubscribeNewsletter() {
  const api = useAPI();
  const [locale] = useLocale();
  const [email, setEmail] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [status, setStatus] = useState<
    null | 'submitting' | 'submitted' | 'error'
  >(null);

  return (
    <div className="dataset-subscribe">
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault();

            if (!privacyAgreed) {
              setStatus('error');
              return;
            }

            setStatus('submitting');
            try {
              await api.subscribeToNewsletter(email);
              trackGlobal('footer-newsletter', locale);
              setStatus('submitted');
            } catch (e) {
              setStatus('error');
              console.error(e);
            }
          }}>
          <div className="submittable-field">
            <LocalizedGetAttribute id="e-mail-input" attribute="label">
              {label => (
                <input
                  className={email.length > 0 ? 'has-value' : ''}
                  type="email"
                  value={email}
                  onChange={event => {
                    setEmail(event.target.value);
                    setStatus(null);
                  }}
                  placeholder={label}
                  required
                />
              )}
            </LocalizedGetAttribute>
            <Button
              type="submit"
              disabled={status != null}
              {...(status == 'submitted'
                ? {
                    className: 'success-button',
                    children: <CheckIcon className="icon" />,
                  }
                : status == 'error'
                ? {
                    className: 'error-button',
                    children: <CautionIcon className="icon" />,
                  }
                : {
                    className: 'submit-button',
                    children: <OldPlayIcon className="icon" />,
                  })}
            />
          </div>
          <LabeledCheckbox
            label={
              <Localized
                id="accept-privacy"
                privacyLink={<LocaleLink to={URLS.PRIVACY} blank />}>
                <span />
              </Localized>
            }
            checked={privacyAgreed}
            onChange={(event: any) => {
              setStatus(null);
              setPrivacyAgreed(event.target.checked);
            }}
          />
        </form>
      </div>
    </div>
  );
}
