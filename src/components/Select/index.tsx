import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Subject } from 'rxjs';
import classNames from 'classnames';

import Button from '../Button';
import ConnectedOverlay from '../ConnectedOverlay';

import './style.less';

class SelectController<T> {
  private options: OptionProps<T>[] = [];

  onOptionSelect$ = new Subject<T>();

  constructor(private keyExtractor: (item: T) => string | number = defaultKeyExtractor) { }

  getOptionByValue(value: T) {
    return this.options.find(o => this.keyExtractor(o.value) === this.keyExtractor(value));
  }

  addOption(option: OptionProps<T>) {
    this.options.push(option);
  }

  removeOption(option: OptionProps<T>) {
    const index = this.options.findIndex(o => this.keyExtractor(o.value) === this.keyExtractor(option.value));
    if (index !== -1) {
      this.options.splice(index, 1);
    }
  }
}

const SelectContext = createContext(new SelectController<any>());

export interface SelectProps<T> {
  value: T | undefined;
  onChange?: (value: T | undefined) => void;
  keyExtractor?: (item: T) => string | number;
  placeholder?: string;
  children: React.ReactNode;
}

export function Select<T>(props: SelectProps<T>) {
  const { children, keyExtractor = defaultKeyExtractor, onChange, placeholder, value } = props;

  const selectButtonRef = useRef<HTMLButtonElement>(null);

  const [showOptions, setShowOptions] = useState(false);

  const controller = useMemo(() => new SelectController<T>(keyExtractor), []);

  useEffect(() => {
    const subscription = controller.onOptionSelect$.subscribe(value => {
      setShowOptions(false);
      onChange?.(value);
    });
    return () => subscription.unsubscribe();
  }, []);

  const selectedContent = useMemo(() => {
    if (value === undefined) {
      return;
    }
    const option = controller.getOptionByValue(value);
    if (option) {
      return option.children;
    }
  }, [value && keyExtractor(value)]);

  function onClick() {
    // TODO: get overlay position
    setShowOptions(true);
  }

  return (<>
    <Button ref={selectButtonRef} onClick={onClick}>
      {selectedContent ?? placeholder}
    </Button>
    {showOptions && <SelectContext.Provider value={controller}>
      <ConnectedOverlay connectedTo={selectButtonRef} verticalFlexable>
        {children}
      </ConnectedOverlay>
    </SelectContext.Provider>}
  </>);
}

export interface OptionProps<T> {
  value: T;
  children?: React.ReactNode;
  disabled?: boolean;
}

export function Option<T>(props: OptionProps<T>) {
  const { value, children, disabled } = props;

  const controller = useContext(SelectContext);

  useEffect(() => {
    controller.addOption(props);
    return () => {
      controller.removeOption(props);
    }
  }, []);

  function onClick() {
    if (!disabled) {
      controller.onOptionSelect$.next(value);
    }
  }

  return <div
    className={classNames('select-option', { 'select-option-dsiabled': disabled })}
    onClick={onClick}
  >
    {children}
  </div>;
}


function defaultKeyExtractor<T>(item: T): number | string {
  if (typeof item !== 'number' || typeof item !== 'string') {
    throw new Error('You need to provide a keyExtractor function to the Select component');
  }
  return item;
}
