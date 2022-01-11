import React, { cloneElement, createContext, isValidElement, ReactElement, ReactNode, ReactNodeArray, RefObject, useContext, useEffect, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import classNames from 'classnames';

import Point from '@/utils/Point';
import { useOverlay } from '@/core/ServiceHooks';
import { ConnectionPositionPair } from '@/core/Overlay/PositioinStrategy';
import Button from '../Button';
import ConnectedOverlay from '../ConnectedOverlay';

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
    const options = React.Children.toArray(children)
      .filter(child => isValidElement(child) && child.type === Option)
      .map(child => cloneElement(child as ReactElement<OptionProps<T>, typeof Option>, { onOptionSelect: onChange }));

    const positionStrategy = overlay.position()
      .flexibleConnectedTo(selectButtonRef)
      .withPositions([
        new ConnectionPositionPair(
          { originX: 'start', originY: 'top' }, 
          { overlayX: 'start', overlayY: 'top' },
          -4, -4
        ),
      ])
      .withVerticalFlexible();
    const optionsOverlay = overlay.create({
      positionStrategy,
      hasBackdrop: true,
    });
    optionsOverlay.attach(options);
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
