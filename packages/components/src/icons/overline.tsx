import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const OverlineIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <path
            d="M9 8.99999H15.6V7.79999H9V8.99999ZM15 14.04V10.8C15 10.44 14.76 10.2 14.4 10.2C14.04 10.2 13.8 10.44 13.8 10.8V14.04C13.8 14.88 13.26 15.72 12.3 15.72C11.34 15.72 10.8 14.88 10.8 14.04V10.8C10.8 10.44 10.56 10.2 10.2 10.2C9.84 10.2 9.6 10.44 9.6 10.8V14.04C9.6 15.72 10.74 16.92 12.3 16.92C13.86 16.92 15 15.66 15 14.04Z"
            fill="currentColor"
        />
    </svg>
));

OverlineIcon.displayName = 'OverlineIcon';
