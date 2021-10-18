import React, { memo } from 'react';
import type { IconProps } from './types';

export const HamburgerMenuIcon = memo<IconProps>((props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <g fill="none" fillRule="evenodd">
            <path d="M0 0h24v24H0z" />
            <path fill="currentColor" d="M5 7h14a1 1 0 0 1 0 2H5a1 1 0 1 1 0-2z" />
            <rect width="16" height="2" x="4" y="11" fill="currentColor" rx="1" />
            <rect width="16" height="2" x="4" y="15" fill="currentColor" rx="1" />
        </g>
    </svg>
));

HamburgerMenuIcon.displayName = 'HamburgerMenuIcon';
