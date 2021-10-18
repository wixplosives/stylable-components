import React, { memo } from 'react';
import type { IconProps } from './types';

export const XIcon = memo((props: IconProps) => (
    <svg {...props} fill="currentColor" viewBox="0 0 18 18">
        <path d="M8.44 9.5L6 7.06A.75.75 0 1 1 7.06 6L9.5 8.44 11.94 6A.75.75 0 0 1 13 7.06L10.56 9.5 13 11.94A.75.75 0 0 1 11.94 13L9.5 10.56 7.06 13A.75.75 0 0 1 6 11.94L8.44 9.5z" />
    </svg>
));

XIcon.displayName = 'XIcon';
