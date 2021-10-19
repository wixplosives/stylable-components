import React, { memo } from 'react';
import type { IconProps } from '../types';
import { style, classes } from './icon.st.css';

export const HtmlIcon = memo<IconProps>((props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        {...props}
        className={style(classes.root, {}, props.className)}
    >
        <path fill="#EF7623" d="M8 15l6-5.6V12l-4.5 4 4.5 4v2.6L8 17v-2zm16 2.1l-6 5.6V20l4.6-4-4.6-4V9.3l6 5.6v2.2z" />
    </svg>
));

HtmlIcon.displayName = 'HtmlIcon';
