import React, { memo } from 'react';
import type { IconProps } from '../types';
import { style, classes } from './icon.st.css';

export const MarkdownIcon = memo<IconProps>((props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        {...props}
        className={style(classes.root, {}, props.className)}
    >
        <path
            fill="#529BBA"
            d="M20.7 6.7v9.9h3.8c-2.9 3-5.8 5.9-8.7 8.8-2.7-2.8-5.6-5.8-8.4-8.7h3.5V6.6c1.3.9 4.4 3.1 5 3.1.6 0 3.6-2.2 4.8-3z"
        />
    </svg>
));

MarkdownIcon.displayName = 'MarkdownIcon';
