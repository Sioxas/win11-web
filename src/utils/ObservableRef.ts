import { RefObject, useMemo } from "react";
import { BehaviorSubject, Observable } from "rxjs";

export class ObservableRef<T> implements RefObject<T>{
  #refValue: BehaviorSubject<T | null>;

  get observable(): Observable<T | null> {
    return this.#refValue.asObservable();
  }

  get current(): T | null {
    return this.#refValue.value;
  }

  set current(value: T | null) {
    if (value !== this.#refValue.value) {
      this.#refValue.next(value);
    }
  }

  constructor(value: T | null) {
    this.#refValue = new BehaviorSubject(value);
  }
}

export function useObservableRef<T>(value: T): RefObject<T> {
  return useMemo(() => new ObservableRef(value), []);
}
