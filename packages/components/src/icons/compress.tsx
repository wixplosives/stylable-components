import React from 'react';
import { IconFactory } from './icon.js';

export const CompressIcon = IconFactory(
    <g fill="currentColor" fillRule="evenodd" transform="translate(6 6)">
        <path d="M5,0 L5,4.28571429 C5,4.68020339 4.73663809,5 4.41176471,5 L0,5 L0,3.75 L3.75,3.75 L3.75,0 L5,0 Z" />
        <path
            d="M5,7 L5,11.2857143 C5,11.6802034 4.73663809,12 4.41176471,12 L0,12 L0,10.75 L3.75,10.75 L3.75,7 L5,7 Z"
            transform="matrix(1 0 0 -1 0 19)"
        />
        <path
            d="M12,0 L12,4.28571429 C12,4.68020339 11.7366381,5 11.4117647,5 L7,5 L7,3.75 L10.75,3.75 L10.75,0 L12,0 Z"
            transform="matrix(-1 0 0 1 19 0)"
        />
        <path
            d="M12,7 L12,11.2857143 C12,11.6802034 11.7366381,12 11.4117647,12 L7,12 L7,10.75 L10.75,10.75 L10.75,7 L12,7 Z"
            transform="rotate(180 9.5 9.5)"
        />
    </g>,
    'CompressIcon',
    24,
    24,
);
