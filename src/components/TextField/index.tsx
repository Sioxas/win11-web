import { ReactNode, useState } from "react";
import classNames from "classnames";

import './style.less';

export interface TextFieldProps {
  className?: string;
  id?: string;
  label?: string;
  name?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  value?: string;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  prefix?: ReactNode;
}

export default function TextField(props: TextFieldProps) {
  const {
    className,
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    onFocus,
    disabled,
    type,
    size,
    prefix,
    ...rest
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  function handleFocus(event: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    onFocus?.(event);
  };

  function handleBlur(event: React.FocusEvent<HTMLInputElement>) {
    setIsFocused(false);
    onBlur?.(event);
  };

  return (
    <div className={classNames('text-field', {
      'text-field--large': size === 'large',
    }, className)}>
      {prefix && <span className='text-field__prefix'>{prefix}</span>}
      <input
        className='text-field__input'
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        {...rest}
      />
      <span className='text-field__suffix'></span>
    </div>
  );
}