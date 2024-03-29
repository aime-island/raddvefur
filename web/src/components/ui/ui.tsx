import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { HTMLProps, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LocaleLink } from '../locale-helpers';
import { CheckIcon } from './icons';

export const Avatar = ({ url }: { url?: string }) => (
  <div className="avatar-wrap">
    {url ? (
      <img src={url} />
    ) : (
      <img
        className="mars-avatar"
        src={require('./icons/mars-avatar.svg')}
        alt="Robot Avatar"
      />
    )}
  </div>
);

export const Button = ({
  className = '',
  outline = false,
  rounded = false,
  count = false,
  blue = false,
  ...props
}) => (
  <button
    type="button"
    className={[
      'button',
      outline ? 'outline' : '',
      rounded ? 'rounded' : '',
      blue ? 'blue' : '',
      count ? 'count' : '',
      className,
    ].join(' ')}
    {...props}
  />
);

export const CardAction = ({ className, ...props }: any) =>
  props.to ? (
    <LocaleLink className={'card-action ' + className} {...props} />
  ) : (
    <Button outline className={'card-action ' + className} {...props} />
  );

export const Hr = (props: any) => <hr className="hr" {...props} />;

export const LabeledCheckbox = React.forwardRef(
  ({ label, style, ...props }: any, ref) => (
    <label className="labeled-checkbox" style={style}>
      <span className="checkbox-container">
        <input ref={ref} type="checkbox" {...props} />
        <CheckIcon className="checkmark" />
      </span>
      <span className="label">{label}</span>
    </label>
  )
);

const LabeledFormControl = React.forwardRef(
  (
    { className = '', component: Component, label, required, ...props }: any,
    ref
  ) => {
    const child = <Component {...{ ref, required, ...props }} />;
    return (
      <label
        className={[
          'labeled-form-control',
          'for-' + Component,
          className,
          props.disabled ? 'disabled' : '',
        ].join(' ')}
        {...props}>
        <span className="label">
          {required && '*'}
          {label}
        </span>
        {Component == 'select' ? (
          <div className="wrapper with-down-arrow">{child}</div>
        ) : (
          child
        )}
      </label>
    );
  }
);

export const LabeledInput = React.forwardRef(({ type, ...props }: any, ref) => (
  <LabeledFormControl
    component="input"
    ref={ref}
    type={type || 'text'}
    {...props}
  />
));

export const LabeledSelect = (props: any) => (
  <LabeledFormControl component="select" {...props} />
);

export const LabeledTextArea = (props: any) => (
  <LabeledFormControl component="textarea" {...props} />
);

export const LinkButton = ({
  className = '',
  blank = false,
  outline = false,
  rounded = false,
  blue = false,
  absolute = false,
  ...props
}: any) => {
  const Component = props.to ? (absolute ? Link : LocaleLink) : 'a';
  return (
    <Component
      className={[
        'button',
        outline ? 'outline' : '',
        rounded ? 'rounded' : '',
        blue ? 'blue' : '',
        className,
      ].join(' ')}
      {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
};

export const Spinner = ({ delayMs }: { delayMs?: number }) => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => setShowSpinner(true), delayMs);
    return () => clearTimeout(timeoutId);
  }, []);

  return showSpinner ? (
    <div className="spinner">
      <span />
    </div>
  ) : null;
};
Spinner.defaultProps = { delayMs: 300 };

export const StyledLink = ({
  blank = false,
  className,
  ...props
}: (
  | React.HTMLProps<HTMLAnchorElement>
  | React.ComponentProps<typeof LocaleLink>) & { blank?: boolean }) => {
  const Component = props.href ? 'a' : LocaleLink;
  return (
    <Component
      className={'link ' + (className || '')}
      {...(blank ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    />
  );
};

export const TextButton = ({ className = '', ...props }: any) => (
  <button type="button" className={'text-button ' + className} {...props} />
);

export const Toggle = ({
  offText,
  onText,
  ...props
}: { offText: string; onText: string } & HTMLProps<HTMLInputElement>) => (
  <div className="toggle-input">
    <input type="checkbox" {...props} />
    <Localized id={offText}>
      <div />
    </Localized>
    <Localized id={onText}>
      <div />
    </Localized>
  </div>
);

interface Option {
  text: string;
  value: number;
}

export class Radio extends React.Component<any, any> {
  state: any = {
    checked: 15,
  };

  constructor(props: any) {
    super(props);
  }

  private setSelected = (selected: number) => {
    this.setState({
      checked: selected,
    });
  };

  render() {
    return (
      <div className="buttons">
        {this.props.options.map((option: Option) => (
          <div className="radio-input">
            <label
              className={[
                'button outline rounded count',
                this.state.checked == option.value ? 'blue' : '',
              ].join(' ')}>
              <input
                type="radio"
                name={name}
                value={option.value}
                {...this.props}
                onClick={() => this.setSelected(option.value)}
              />
              {option.text}
            </label>
          </div>
        ))}
      </div>
    );
  }
}

export const Radioass = ({
  options,
  name,
  ...props
}: { options: Option[]; name: string } & HTMLProps<HTMLInputElement>) => (
  <div className="radio-inputs">
    {options.map((option: Option) => (
      <div className="radio-input">
        <label className="button rounded outline blue count">
          <input type="radio" name={name} value={option.value} {...props} />
          {option.text}
        </label>
      </div>
    ))}
  </div>
);

export const ToggleIs = ({
  offText,
  onText,
  ...props
}: { offText: string; onText: string } & HTMLProps<HTMLInputElement>) => (
  <div className="toggle-input">
    <input type="checkbox" {...props} />
    <div>{offText}</div>
    <div>{onText}</div>
  </div>
);
