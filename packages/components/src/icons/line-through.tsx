import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const LineThroughIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.4002 12.6V13.44C14.4002 15.06 13.2602 16.32 11.7002 16.32C10.1402 16.32 9.0002 15.12 9.0002 13.44V12.6H7.2002V11.4H9.0002V9.00002C9.0002 8.64002 9.2402 8.40002 9.6002 8.40002C9.9602 8.40002 10.2002 8.64002 10.2002 9.00002V11.4H13.2002V9.00002C13.2002 8.64002 13.4402 8.40002 13.8002 8.40002C14.1602 8.40002 14.4002 8.64002 14.4002 9.00002V11.4H16.2002V12.6H14.4002ZM13.2002 12.6V13.44C13.2002 14.28 12.6602 15.12 11.7002 15.12C10.7402 15.12 10.2002 14.28 10.2002 13.44V12.6H13.2002Z"
            fill="currentColor"
        />
    </svg>
));

LineThroughIcon.displayName = 'LineThroughIcon';
