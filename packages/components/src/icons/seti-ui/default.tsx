import React, { memo } from 'react';
import type { IconProps } from '../types';
import { style, classes } from './seti-icon.st.css';

export const DefaultIcon = memo<IconProps>((props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 1000"
        {...props}
        className={style(classes.root, {}, props.className)}
    >
        <path d="M394.1 537.8h411.7v54.7H394.1v-54.7zm0-130.3H624v54.7H394.1v-54.7zm0-130.3h411.7v54.7H394.1v-54.7zm0 390.9H700v54.7H394.1v-54.7z" />
    </svg>
));

DefaultIcon.displayName = 'DefaultIcon';
