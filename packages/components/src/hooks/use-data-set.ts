import { useEffect, useMemo, useReducer, useRef } from 'react';
import { reportError } from '../common/errors';

export interface DataSet<T> {
  getItems: (from: number, count: number) => T[] | Promise<T[]>;
  totalItems: () => number | Promise<number>;
}

export interface DataSetRes<T> {
  from: number;
  items: T[];
}

export const useDataSet = <T>(data: T[] | DataSet<T>, from: number, count: number): DataSetRes<T> => {
  const initial = useMemo(() => {
    if (Array.isArray(data)) {
      return { items: data.slice(from, count), from };
    }
    return { items: [], from };
  }, [data, from, count]);
  const [_, updateVer] = useReducer((version: number) => version++, 0);
  const current = useRef(initial);
  if (Array.isArray(data)) {
    current.current = initial;
  }
  useEffect(() => {
    let isDisposed = false;
    const execute = (value: T[]) => {
      current.current.from = from;
      current.current.items = value;
      if (!isDisposed) {
        updateVer();
      }
    };
    if (!Array.isArray(data)) {
      const items = data.getItems(from, count);
      if (Array.isArray(items)) {
        execute(items);
      } else {
        items.then(execute).catch(reportError);
      }
    }
    return () => {
      isDisposed = true;
    };
  });
  return current.current;
};
