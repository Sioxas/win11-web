import { createContext, useContext, useEffect, useMemo } from 'react';
import classNames from 'classnames';

import Button from '../Button';

import './style.less';

const SelectContext = createContext({
  registerOption: (option: OptionProps<any>) => { },
  unregisterOption: (option: OptionProps<any>) => { },
});

export interface SelectProps<T> {
  value: T | undefined;
  onChange?: (value: T | undefined) => void;
  keyExtractor?: (item: T) => string | number;
  placeholder?: string;
  children: React.ReactNode;
}

export function Select<T>(props: SelectProps<T>) {
  const { children, keyExtractor = defaultKeyExtractor } = props;
  const contextValue = useMemo(() => {
    let options: OptionProps<T>[] = [];
    function registerOption(option: OptionProps<T>) {
      options.push(option);
    }
    function unregisterOption(option: OptionProps<T>) {
      let index = -1;
      for (let i = 0; i < options.length; i++) {
        if(keyExtractor(options[i].value) === keyExtractor(option.value)){
          index = i;
          break;
        }
      }
      if (index >= 0) {
        options.splice(index, 1);
      }
    }
    return { registerOption, unregisterOption };
  }, []);

  return (<>
    <Button>

    </Button>
    <SelectContext.Provider value={contextValue}>
      {children}
    </SelectContext.Provider>
  </>
  );
}

export interface OptionProps<T> {
  value: T;
  chidlren?: React.ReactNode;
  disabled?: boolean;
}

export function Option<T>(props: OptionProps<T>) {
  const { registerOption, unregisterOption } = useContext(SelectContext);
  useEffect(() => {
    registerOption(props);
    return () => {
      unregisterOption(props);
    };
  }, []);
  return null;
}


function defaultKeyExtractor<T>(item: T): number | string {
  if (typeof item !== 'number' || typeof item !== 'string') {
    throw new Error('You need to provide a keyExtractor function to the Select component');
  }
  return item;
}