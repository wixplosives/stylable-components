import { useMemo, useState } from 'react';

export type NotAnArray<T> = T extends any[] ? never : T;

export type ControlledState<T, M> = [value: T | (() => T), setValue: (t: T, meta?: M) => void];
export type UnControlledState<T> = NotAnArray<T> | (() => T);
export type LockedState<T> = [defaultValue: T | (() => T), isDisabled: true];

export type ProcessedControlledState<T, M = any> = [value: T, setValue: (t: T, meta?: M) => void];
export type StateControls<T, M = any> = ControlledState<T, M> | UnControlledState<T> | LockedState<T>;

const noop = () => undefined;

export function useStateControls<T, M = any>(
    options: StateControls<T, M> | undefined,
    //default value passed by the component, ignored if a value was passed in the options
    defaultValue: T | (() => T),
    useStateFunction: (t: T | (() => T)) => ProcessedControlledState<T, M> = useState,
) {
    const status =
        options === undefined
            ? 'stateful'
            : Array.isArray(options)
              ? options[1] === true
                  ? 'locked'
                  : 'controlled'
              : 'stateful';
    const valueOrFactory = options === undefined ? defaultValue : Array.isArray(options) ? options[0] : options;
    const [value, setValue] = useStateFunction(valueOrFactory);
    return useMemo<ProcessedControlledState<T, M>>(() => {
        switch (status) {
            case 'controlled': {
                const [funcOrValue, setter] = options as ControlledState<T, M>;
                if (typeof funcOrValue === 'function') {
                    return [(funcOrValue as () => T)(), setter];
                }
                return options as ProcessedControlledState<T, M>;
            }
            case 'locked':
                return [value, noop];
            case 'stateful':
                return [value, setValue];
        }
    }, [status, options, value, setValue]);
}
