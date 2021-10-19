import React from 'react';
import { IconFactory } from './icon';

export const NullIcon = IconFactory(
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
    />,
    'NullIcon',
    18,
    18
);
