import React, { memo } from 'react';
import type { IconProps } from './types';

export const CollapseIcon = memo<IconProps>((props) => {
    return (
        <svg {...props} width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" fillRule="evenodd">
                <path d="M0 0h24v24H0z" />
                <path
                    fill="currentColor"
                    d="M11.53 7.47a.75.75 0 0 1 1.134.976l-.073.084L9.121 12l3.47 3.47a.75.75 0 0 1 .073.976l-.073.084a.75.75 0 0 1-.977.073l-.084-.073L7 12l4.53-4.53z"
                />
                <path
                    fill="currentColor"
                    d="M16.53 7.47a.75.75 0 0 1 1.134.976l-.073.084-3.47 3.47 3.47 3.47a.75.75 0 0 1 .073.976l-.073.084a.75.75 0 0 1-.977.073l-.084-.073L12 12l4.53-4.53z"
                />
            </g>
        </svg>
    );
});

CollapseIcon.displayName = 'CollapseIcon';
