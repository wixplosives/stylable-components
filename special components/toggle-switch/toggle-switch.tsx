import React, { FC } from 'react';
import { style, classes } from './toggle-switch.st.css';

export type ToggleSwitchProps = React.HTMLAttributes<HTMLDivElement>;

export const ToggleSwitch: FC<ToggleSwitchProps> = (props) => {
    return <div {...props} className={style(classes.root, props.className)} />;
};
