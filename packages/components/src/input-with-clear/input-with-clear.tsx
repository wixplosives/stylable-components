import React, { useCallback } from 'react';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { XIcon } from '../icons';
import { st, classes } from './input-with-clear.st.css';
export interface InputWithClearProps extends React.HTMLAttributes<HTMLInputElement> {
    valueControl?: StateControls<string>;
}

export const InputWithClear: React.FC<InputWithClearProps> = (props: InputWithClearProps) => {
    const [value, setValue] = useStateControls(props.valueControl || '');
    const onClear = useCallback(() => {
        setValue('');
    }, [setValue]);
    const onChange = useCallback(
        (ev: React.ChangeEvent<HTMLInputElement>) => {
            setValue(ev.currentTarget.value);
        },
        [setValue]
    );
    return (
        <div className={st(classes.root, props.className)}>
            <input {...props} className={classes.input} value={value} onChange={onChange} />
            <XIcon className={classes.clear} onClick={onClear}></XIcon>
        </div>
    );
};
