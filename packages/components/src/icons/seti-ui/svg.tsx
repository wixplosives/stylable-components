import React, { memo } from 'react';
import type { IconProps } from '../types';
import { style, classes } from './seti-icon.st.css';

export const SvgIcon = memo<IconProps>((props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        {...props}
        className={style(classes.root, {}, props.className)}
    >
        <path opacity=".5" d="M11.5 11.4H17c0-2-2.3-4.9-5.1-4.9s-5.3 2.4-5.3 5.2 2.9 5.2 4.9 5.2v-5.5z" />
        <path d="M13.6 13.7h11.8v11.8H13.6z" />
    </svg>
));

SvgIcon.displayName = 'SvgIcon';
