import { useMemo, useState } from 'react';

export type ControlledState<T> = [value: T, setValue: (t: T) => void];
export type UnControlledState<T> = T | [T];
export type LockedState<T> = [defaultValue: T, isDisabled: true];

export function isControlled<T>(value: StateControls<T>): value is ControlledState<T> {
    if (!Array.isArray(value)) {
        return false;
    }
    const [_, cb] = value;
    return cb !== true && cb !== undefined;
}

export type StateControls<T> = ControlledState<T> | UnControlledState<T> | LockedState<T>;

const noop = () => undefined;

export function useStateControls<T>(
    options: StateControls<T>,
    useStateFunction: (t: T) => ControlledState<T> = useState
): ControlledState<T> {
    const [value, setValue] = useStateFunction(Array.isArray(options) ? options[0] : options);
    const unControlledRes = useMemo<ControlledState<T>>(
        () => (Array.isArray(options) && options.length > 1 ? [value, noop] : [value, setValue]),
        [options, value, setValue]
    );
    if (isControlled(options)) {
        return options;
    }

    return unControlledRes;
}
