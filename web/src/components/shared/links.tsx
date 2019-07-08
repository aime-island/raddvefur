import * as React from 'react';
import { useState } from 'react';
import { TextButton } from '../ui/ui';
import { trackGlobal } from '../../services/tracker';
//import ContactModal from '../contact-modal/contact-modal';
import { useLocale, useLocalizedDiscourseURL } from '../locale-helpers';

interface SharedLinkProps {
  id?: string;
  children?: React.ReactNode;
  className?: string;
  dispatch?: any;
}

export const GitHubLink = ({ dispatch, ...props }: SharedLinkProps) => {
  return (
    <a target="_blank" href="https://www2.deloitte.com/is/is.html" {...props} />
  );
};

export const DiscourseLink = ({ dispatch, ...props }: SharedLinkProps) => {
  return (
    <a
      target="blank"
      href="https://www.rannis.is/sjodir/menntun/nyskopunarsjodur-namsmanna/"
      {...props}
    />
  );
};

export const AlmannaLink = ({ dispatch, ...props }: SharedLinkProps) => {
  return (
    <a
      target="blank"
      href="https://www.facebook.com/almannaromur/"
      {...props}
    />
  );
};

export const SlackLink = ({ dispatch, ...props }: SharedLinkProps) => {
  return <a target="blank" href="https://www.ru.is/skema/" {...props} />;
};

export const MozillaLink = ({ dispatch, ...props }: SharedLinkProps) => {
  const [locale] = useLocale();
  return (
    <a
      target="blank"
      href="https://voice.mozilla.org/en"
      onClick={() => trackGlobal('slack', locale)}
      {...props}
    />
  );
};
