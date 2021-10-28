import React, { useCallback } from 'react';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { XIcon } from '../icons';
import { KeyCodes } from '../keycodes';
import { st, classes } from './input-with-clear.st.css';
export interface InputWithClearProps extends React.HTMLAttributes<HTMLInputElement> {
    valueControl?: StateControls<string>;
}

export const InputWithClear: React.FC<InputWithClearProps> = (props: InputWithClearProps) => {
    const { valueControl, onKeyDown, ...inputProps } = props;
    const [value, setValue] = useStateControls(valueControl || '');
    const onClear = useCallback(() => {
        setValue('');
    }, [setValue]);
    const onChange = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setValue(ev.currentTarget.value);
        },
        [setValue]
    );
    const keyDown = useCallback(
        (ev: React.KeyboardEvent<HTMLInputElement>) => {
            if (onKeyDown) {
                onKeyDown(ev);
            }
            if (ev.code === KeyCodes.Escape) {
                onClear();
            }
        },
        [onClear, onKeyDown]
    );
    return (
        <div className={st(classes.root, props.className)}>
            <input {...inputProps} className={classes.input} value={value} onChange={onChange} onKeyDown={keyDown} />
            <XIcon className={classes.clear} onClick={onClear}></XIcon>
        </div>
    );
};
