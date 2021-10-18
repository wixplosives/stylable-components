import React, { memo } from 'react';
import type { IconProps } from './types';

export const PasteIcon = memo<IconProps>((props) => (
    <svg width="18" height="18" viewBox="0 0 18 18" {...props}>
        <path
            d="M7,0A1,1,0,0,1,8,1H9a1,1,0,0,1,1,1v9a1,1,0,0,1-1,1H1a1,1,0,0,1-1-1V2A1,1,0,0,1,1,1H2A1,1,0,0,1,3,0ZM7,3H3A1,1,0,0,1,2,2H1v9H9V2H8A1,1,0,0,1,7,3ZM3,1V2H7V1Z"
            transform="translate(4 3)"
            fill="currentColor"
        />
    </svg>
));

PasteIcon.displayName = 'PasteIcon';
