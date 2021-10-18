import React, { memo } from 'react';
import type { IconProps } from './types';

export const WindowIcon = memo<IconProps>((props) => (
    <svg {...props} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6 5H12C12.5523 5 13 5.44772 13 6V7H5V6C5 5.44772 5.44772 5 6 5ZM4 8V7V6C4 4.89543 4.89543 4 6 4H12C13.1046 4 14 4.89543 14 6V7V8V12C14 13.1046 13.1046 14 12 14H6C4.89543 14 4 13.1046 4 12V8ZM13 8V12C13 12.5523 12.5523 13 12 13H6C5.44772 13 5 12.5523 5 12V8H13Z"
            fill="currentColor"
        />
    </svg>
));

WindowIcon.displayName = 'WindowIcon';
