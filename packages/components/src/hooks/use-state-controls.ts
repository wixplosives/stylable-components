import { useMemo, useState } from 'react';

export type NotAnArray<T> = T extends any[] ? never : T;

export type ControlledState<T> = [value: T | (() => T), setValue: (t: T) => void];
export type UnControlledState<T> = NotAnArray<T> | (() => T);
export type LockedState<T> = [defaultValue: T | (() => T), isDisabled: true];

export type ProcessedControlledState<T> = [value: T, setValue: (t: T) => void];
export type StateControls<T> = ControlledState<T> | UnControlledState<T> | LockedState<T>;

const noop = () => undefined;

export function useStateControls<T>(
    options: StateControls<T> | undefined,
    //default value passed by the component, ignored if a value was passed in the options
    defaultValue: T | (() => T),
    useStateFunction: (t: T | (() => T)) => ProcessedControlledState<T> = useState
): ProcessedControlledState<T> {
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
    return useMemo<ProcessedControlledState<T>>(() => {
        switch (status) {
            case 'controlled': {
                const [funcOrValue, setter] = options as ControlledState<T>;
                if (typeof funcOrValue === 'function') {
                    return [(funcOrValue as () => T)(), setter];
                }
                return options as ProcessedControlledState<T>;
            }
            case 'locked':
                return [value, noop];
            case 'stateful':
                return [value, setValue];
        }
    }, [status, options, value, setValue]);
}
