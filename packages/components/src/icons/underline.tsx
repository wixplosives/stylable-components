import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const UnderlineIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <path
            d="M9 16.8H15.6V15.6H9V16.8ZM15 11.64V8.39999C15 8.03999 14.76 7.79999 14.4 7.79999C14.04 7.79999 13.8 8.03999 13.8 8.39999V11.64C13.8 12.48 13.26 13.32 12.3 13.32C11.34 13.32 10.8 12.48 10.8 11.64V8.39999C10.8 8.03999 10.56 7.79999 10.2 7.79999C9.84 7.79999 9.6 8.03999 9.6 8.39999V11.64C9.6 13.32 10.74 14.52 12.3 14.52C13.86 14.52 15 13.26 15 11.64Z"
            fill="currentColor"
        />
    </svg>
));

UnderlineIcon.displayName = 'UnderlineIcon';
