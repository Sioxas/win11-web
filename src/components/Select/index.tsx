import React, { cloneElement, isValidElement, ReactElement, ReactNode, ReactNodeArray, RefObject, useRef } from 'react';
import classNames from 'classnames';

import Point from '@/utils/Point';
import { useOverlay } from '@/core/ServiceHooks';
import { PositionStrategy } from '@/core/Overlay/PositioinStrategy';
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
        positionStrategy.withAlignedOptionIndex(optionIndex);
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

class SelectOptionsPositionStrategy implements PositionStrategy {

  private overlayRef?: RefObject<HTMLElement>

  private optionIndex = 0;

  private verticalFlexible = false;

  private horizontalFlexible = false;

  private offset = new Point(0, 0);

  constructor(private origin: RefObject<HTMLButtonElement>) { }

  withAlignedOptionIndex(index: number) {
    this.optionIndex = index;
    return this;
  }

  withVertivalFlexible(verticalFlexible = true) {
    this.verticalFlexible = verticalFlexible;
    return this;
  }

  withHorizontalFlexible(horizontalFlexible = true) {
    this.horizontalFlexible = horizontalFlexible;
    return this;
  }

  withOffset(offsetX: number, offsetY: number) {
    this.offset = { x: offsetX, y: offsetY };
    return this;
  }

  attach(overlayRef: RefObject<HTMLElement>): void {
    this.overlayRef = overlayRef;
  }

  apply(): void {
    if (!this.origin.current || !this.overlayRef?.current) {
      throw new Error("origin and overlayRef must be set before apply position strategy");
    }

    let
      originRect = this.origin.current.getBoundingClientRect(),
      overlayRect = this.overlayRef.current.getBoundingClientRect();

    const overlayPosition = this.getOverlayPosition(this.overlayRef.current, overlayRect, originRect);
    this.adjustOverlayPosition(overlayPosition, overlayRect);
    this.applyPosition(overlayPosition);
  }

  dispose(): void {
  }

  private getOverlayPosition(overlayElement: HTMLElement, overlayRect: DOMRect, originRect: DOMRect): Point {
    let
      index = this.optionIndex >= 0 && this.optionIndex < overlayElement.children.length ? this.optionIndex : 0,
      option = overlayElement.children[index],
      optionRect = option.getBoundingClientRect(),
      /** Position of option relative to overlay */
      optionRelativePosition = new Point(optionRect.left - overlayRect.left, optionRect.top - overlayRect.top);

    return new Point(
      originRect.left - optionRelativePosition.x + this.offset.x,
      originRect.top - optionRelativePosition.y + this.offset.y
    );
  }

  private adjustOverlayPosition(overlayPoint: Point, overlayRect: DOMRect) {
    const { width, height } = overlayRect;
    if (this.horizontalFlexible) {
      if (overlayPoint.x < 0) {
        overlayPoint.x = 0;
      } else if (overlayPoint.x + width > window.innerWidth) {
        overlayPoint.x = window.innerWidth - width;
      }
    }
    if (this.verticalFlexible) {
      if (overlayPoint.y < 0) {
        overlayPoint.y = 0;
      } else if (overlayPoint.y + height > window.innerHeight) {
        overlayPoint.y = window.innerHeight - height;
      }
    }
  }

  /**
   * Applies a computed position to the overlay.
   * @param overlayPoint The overlay element start point.
   */
  private applyPosition(overlayPoint: Point) {
    const overlayElement = this.overlayRef?.current;
    if (overlayElement) {
      let { x, y } = overlayPoint;
      overlayElement.style.position = 'absolute';
      overlayElement.style.zIndex = '1000';
      overlayElement.style.left = `${x}px`;
      overlayElement.style.top = `${y}px`;
    }
  }
}
