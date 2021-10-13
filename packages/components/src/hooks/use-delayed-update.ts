import { useCallback, useReducer, useRef } from 'react';

export const useDelayedUpdate = () => {
  const [_, update] = useReducer((n) => ++n, 0);
  const triggeredForUpdate = useRef(false);
  return useCallback(() => {
    if (triggeredForUpdate.current) {
      return;
    }
    triggeredForUpdate.current = true;
    const cb = () => {
      triggeredForUpdate.current = false;
      update();
    };
    const handle = window.requestAnimationFrame(cb);

    return () => {
      window.cancelAnimationFrame(handle);
    };
  }, []);
};

export const useDelayedUpdateState = <T>(setValue: (t: T) => void) => {
  const triggeredForUpdate = useRef(false);
  return useCallback((value: T | (() => T)) => {
    if (triggeredForUpdate.current) {
      return;
    }
    triggeredForUpdate.current = true;
    const cb = () => {
      triggeredForUpdate.current = false;
      const val = typeof value === 'function' ? (value as () => T)() : value;
      setValue(val);
    };
    const handle = window.requestAnimationFrame(cb);

    return () => {
      window.cancelAnimationFrame(handle);
    };
  }, [setValue]);
};
