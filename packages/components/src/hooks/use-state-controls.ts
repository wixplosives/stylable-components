import { useMemo, useState } from 'react';

export type ControlledState<T> = [value: T, setValue: (t: T) => void];
export type UnControlledState<T> = [defaultValue: T, isDisabled?: true];

export function isControlled<T>(value: StateControls<T>): value is ControlledState<T> {
  const [_, cb] = value;
  return !!cb && cb !== true;
}

export type StateControls<T> = ControlledState<T> | UnControlledState<T>;

const noop = () => undefined;

export function useStateControls<T>(options: StateControls<T>, useStateFunction:(t:T)=>ControlledState<T> = useState): ControlledState<T> {
  const [value, setValue] = useStateFunction(options[0]);
  const unControlledRes = useMemo<ControlledState<T>>(
    () => (options[1] ? [value, noop] : [value, setValue]),
    [options, value, setValue]
  );
  if (isControlled(options)) {
    return options;
  }
  return unControlledRes;
}
