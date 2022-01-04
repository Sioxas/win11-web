import { useMemo } from "react";
import { Container, Constructable } from 'typedi';

export function useService<T>(service: Constructable<T>) {
  return useMemo(() => Container.get<T>(service), []);
}
