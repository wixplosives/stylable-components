import React, { memo } from 'react';
import type { IconProps } from './types';

export const DisplayIcon = memo<IconProps>((props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
        <g fill="currentColor">
            <path
                d="M13 0H1C.172 0 0 .172 0 1v8c0 .828.172 1 1 1h12c.828 0 1-.172 1-1V1c0-.828-.172-1-1-1zM1 1h12v8H1V1zM11 12L11 13 3 13 3 12z"
                transform="translate(5 6)"
            />
        </g>
    </svg>
));

DisplayIcon.displayName = 'DisplayIcon';
