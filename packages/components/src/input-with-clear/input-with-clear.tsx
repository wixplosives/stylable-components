import React, { useCallback, useRef } from 'react';
import { StateControls, useStateControls } from '../hooks/use-state-controls.js';
import { XIcon } from '../icons/index.js';
import { st, classes } from './input-with-clear.st.css';
export interface InputWithClearProps extends React.HTMLAttributes<HTMLInputElement> {
    valueControl?: StateControls<string>;
}

export const InputWithClear = React.forwardRef<HTMLInputElement, InputWithClearProps>((props, ref) => {
    const defaultRef = useRef<HTMLInputElement>(null);
    const usedRef = (ref || defaultRef) as React.RefObject<HTMLInputElement>;
    const { valueControl, onKeyDown, ...inputProps } = props;
    const [value, setValue] = useStateControls(valueControl, '');
    const onClear = useCallback(() => {
        setValue('');
    }, [setValue]);
    const onChange = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setValue(ev.currentTarget.value);
        },
        [setValue],
    );
    const keyDown = useCallback(
        (ev: React.KeyboardEvent<HTMLInputElement>) => {
            if (onKeyDown) {
                onKeyDown(ev);
            }
        },
        [onKeyDown],
    );
    return (
        <div
            className={st(classes.root, props.className)}
            onClick={useCallback(() => {
                if (usedRef.current) {
                    usedRef.current.focus();
                }
            }, [usedRef])}
        >
            <input
                {...inputProps}
                className={classes.input}
                value={value}
                onChange={onChange}
                onKeyDown={keyDown}
                ref={usedRef}
            />
            <XIcon className={classes.clear} onClick={onClear}></XIcon>
        </div>
    );
});
InputWithClear.displayName = 'InputWithClear';
