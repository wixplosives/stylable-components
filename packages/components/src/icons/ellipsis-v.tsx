import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const EllipsisVIcon = memo<IconProps>((props) => (
    <svg
        {...props}
        className={style(classes.root, {}, props.className)}
        viewBox="0 0 192 512"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M96 184c39.8 0 72 32.2 72 72s-32.2 72-72 72-72-32.2-72-72 32.2-72 72-72zM24 80c0 39.8 32.2 72 72 72s72-32.2 72-72S135.8 8 96 8 24 40.2 24 80zm0 352c0 39.8 32.2 72 72 72s72-32.2 72-72-32.2-72-72-72-72 32.2-72 72z" />
    </svg>
));

EllipsisVIcon.displayName = 'EllipsisVIcon';
