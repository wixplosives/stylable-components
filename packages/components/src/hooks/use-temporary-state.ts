import { useCallback, useEffect, useRef, useState } from 'react';
import { ControlledState, StateControls, useStateControls } from './use-state-controls';

export function useTemporaryState<T>(defaultValue: T, keepAlive = 150): [T, (t: T) => void] {
  const [value, setValue] = useState(defaultValue);
  const timeoutId = useRef<number>();
  const disposed = useRef(false);

  const tempSetValue = useCallback(
    (value: T) => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
      setValue(value);
      timeoutId.current = setTimeout(() => {
        if (!disposed.current) {
          setValue(defaultValue);
        }
      }, keepAlive);
    },
    [defaultValue, keepAlive]
  );

  useEffect(() => {
    disposed.current = true;
  }, []);
  return [value, tempSetValue];
}

export function useTemporaryStateControls<T>(options: StateControls<T>, keepAlive = 150): ControlledState<T> {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStateControls(options, (t: T) => useTemporaryState(t, keepAlive));
}
