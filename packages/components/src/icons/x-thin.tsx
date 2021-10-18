import React, { memo } from 'react';
import type { IconProps } from './types';

export const XThinIcon = memo<IconProps>((props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" fill="currentColor" {...props}>
        <path d="M7.2 0L4 3.2 0.8 0 0.1 0.7 3.3 4 0 7.3 0.7 8 4 4.7 7.3 8 8 7.3 4.7 4 7.9 0.7z" />
    </svg>
));

XThinIcon.displayName = 'XThinIcon';
