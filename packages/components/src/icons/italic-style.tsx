import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const ItalicStyleIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <path
            d="M14.3996 9.60002V8.40002H10.1996V9.60002H11.8196L10.8596 15.6H9.59961V16.8H13.7996V15.6H12.0596L13.0196 9.60002H14.3996Z"
            fill="currentColor"
        />
    </svg>
));

ItalicStyleIcon.displayName = 'ItalicStyleIcon';
