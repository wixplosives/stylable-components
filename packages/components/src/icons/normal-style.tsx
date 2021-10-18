import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const NormalStyleIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <path
            d="M14.3 9.60042V8.40042L10 8.40002V9.60002L11.5 9.60042L11.5 15.6004H10V16.8004H14.3V15.6004H12.7V9.60042H14.3Z"
            fill="currentColor"
        />
    </svg>
));

NormalStyleIcon.displayName = 'NormalStyleIcon';
