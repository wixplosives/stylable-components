import React, { memo } from 'react';
import type { IconProps } from './types';

export const NullIcon = memo<IconProps>((props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
        <rect
            x="4.5"
            y="4.5"
            width="9"
            height="9"
            rx="1.5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="3 3"
        />
    </svg>
));

NullIcon.displayName = 'NullIcon';
