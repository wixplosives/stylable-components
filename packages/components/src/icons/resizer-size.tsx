import React, { memo } from 'react';
import type { IconProps } from './types';

export const ResizerSizeIcon = memo<IconProps>((props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 15.556352 15.556352">
        <g id="layer1" transform="translate(-32.298945,-11.134411)">
            <rect width="3" height="17" x="39.212021" y="-23.465586" transform="rotate(45)" />
            <rect width="3" height="9" x="45.212025" y="-19.465586" transform="rotate(45)" />
        </g>
    </svg>
));

ResizerSizeIcon.displayName = 'ResizerSizeIcon';
