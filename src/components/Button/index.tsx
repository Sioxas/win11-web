import classNames from 'classnames';

import './style.less';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'primary' | 'default' | 'warning' | 'danger';
  size?: 'mini' | 'small' | 'default' | 'large';
}

export default function Button({ className, onClick, children, type = 'default',
  size = 'default', disabled, ...restProps }: ButtonProps) {
  return (
    <button className={classNames('button', `button--${type}`, `button-size--${size}`, className)}
      onClick={onClick} {...restProps}>
      {children}
    </button>
  );
}
