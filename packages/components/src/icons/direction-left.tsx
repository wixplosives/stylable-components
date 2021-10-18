import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const DirectionLeftIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <path
            d="M8.63573 13.677L9.60053 14.4L8.63573 15.1236C8.37293 15.324 8.32253 15.7008 8.52353 15.9642C8.64173 16.119 8.81993 16.2 9.00113 16.2C9.12833 16.2 9.25613 16.1604 9.36473 16.077L11.4005 14.4L9.36473 12.7236C9.10073 12.5214 8.72453 12.5736 8.52353 12.8364C8.32253 13.0992 8.37293 13.476 8.63573 13.677ZM14.4005 16.2H15.6005V7.79999H14.4005V16.2ZM11.8175 11.4H12.6005V16.2H13.8005V7.79999H11.8175C10.7273 7.79999 9.84293 8.50979 9.84293 9.59999C9.84293 10.6908 10.7273 11.4 11.8175 11.4Z"
            fill="currentColor"
        />
    </svg>
));

DirectionLeftIcon.displayName = 'DirectionLeftIcon';
