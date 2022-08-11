import { useCallback, useEffect, useReducer, useRef } from 'react';

export const useDelayedUpdate = (): (() => void) => {
    const [_, update] = useReducer((n) => ++n, 0);
    const triggeredForUpdate = useRef<{ handle: number | null }>({ handle: null });
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const handle = triggeredForUpdate.current.handle;
            if (handle !== null) {
                window.cancelAnimationFrame(handle);
            }
        };
    }, []);
    return useCallback(() => {
        if (triggeredForUpdate.current.handle !== null) {
            return;
        }
        const cb = () => {
            triggeredForUpdate.current.handle = null;
            update();
        };
        triggeredForUpdate.current.handle = window.requestAnimationFrame(cb);
    }, []);
};

type DelayedUpdateState<T> = (value: T | (() => T | typeof unchanged)) => void;

export const unchanged = Symbol('unchanged');
export const useDelayedUpdateState = <T>(setValue: (t: T) => void): DelayedUpdateState<T> => {
    const triggeredForUpdate = useRef<{ handle: number | null }>({ handle: null });
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            const handle = triggeredForUpdate.current.handle;
            if (handle !== null) {
                window.cancelAnimationFrame(handle);
            }
        };
    }, []);
    return useCallback(
        (value: T | (() => T | typeof unchanged)) => {
            if (triggeredForUpdate.current.handle !== null) {
                return;
            }
            const cb = () => {
                triggeredForUpdate.current.handle = null;
                const val = typeof value === 'function' ? (value as () => T | typeof unchanged)() : value;
                if (val !== unchanged) {
                    setValue(val);
                }
            };
            triggeredForUpdate.current.handle = window.requestAnimationFrame(cb);
        },
        [setValue]
    );
};
