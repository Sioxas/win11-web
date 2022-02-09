import React, { cloneElement, isValidElement, ReactElement, ReactNode, ReactNodeArray, useRef } from 'react';
import classNames from 'classnames';

import { useOverlay } from '@/core/ServiceHooks';
import SelectOptionsPositionStrategy from './SelectOptionsPositionStrategy';
import Button from '../Button';

import './style.less';

export interface SelectProps<T> {
  value: T | undefined;
  onChange?: (value: T | undefined) => void;
  compareWith?: (o1: T, o2: T) => boolean;
  placeholder?: string;
  children: ReactNodeArray;
}

export function Select<T>(props: SelectProps<T>) {
  const { children, compareWith = defaultCompareFn, onChange, placeholder, value } = props;

  const selectButtonRef = useRef<HTMLButtonElement>(null);

  let selectedContent: ReactNode = placeholder;

  if (value !== undefined) {
    const option = React.Children.toArray(children).find(child => {
      if (isValidElement(child)) {
        return compareWith(value, child.props.value);
      }
      return false;
    });
    if (isValidElement(option)) {
      selectedContent = option.props.children;
    }
  }

  const overlay = useOverlay();

  function onClick() {

    const positionStrategy = new SelectOptionsPositionStrategy(selectButtonRef)
      .withVertivalFlexible()
      .withOffset(1, 0);

    const optionsOverlay = overlay.create({
      positionStrategy,
      hasBackdrop: true,
    });

    function onOptionSelect(value: T) {
      optionsOverlay.detach();
      onChange?.(value);
    }

    const options = React.Children.toArray(children)
      .filter(child => isValidElement(child) && child.type === Option)
      .map(child => cloneElement(child as ReactElement<OptionProps<T>, typeof Option>, { onOptionSelect }));


    if (value) {
      const optionIndex = options.findIndex(option => compareWith(option.props.value, value));
      if (optionIndex !== -1) {
        positionStrategy.alignWith(optionIndex);
      }
    }

    optionsOverlay.attach(options);

    const subscription = optionsOverlay.backdropClick$.subscribe(() => {
      optionsOverlay.detach();
      subscription.unsubscribe();
    });
  }

  return (
    <Button ref={selectButtonRef} onClick={onClick}>
      {selectedContent}
    </Button>
  );
}

export interface OptionProps<T> {
  value: T;
  children?: React.ReactNode;
  disabled?: boolean;
  /** @internal */
  onOptionSelect?: (value: T) => void;
}

export function Option<T>(props: OptionProps<T>) {
  const { value, children, disabled, onOptionSelect } = props;

  function onClick() {
    if (!disabled) {
      onOptionSelect?.(value);
    }
  }

  return <div
    className={classNames('select-option', { 'select-option-dsiabled': disabled })}
    onClick={onClick}
  >
    {children}
  </div>;
}

function defaultCompareFn<T>(a: T, b: T) {
  return a === b;
}

