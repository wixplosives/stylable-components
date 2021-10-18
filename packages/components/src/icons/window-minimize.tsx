import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const WindowMinimizeIcon = memo<IconProps>((props) => (
    <svg
        {...props}
        className={style(classes.root, {}, props.className)}
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M464 352H48c-26.5 0-48 21.5-48 48v32c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48v-32c0-26.5-21.5-48-48-48z" />
    </svg>
));

WindowMinimizeIcon.displayName = 'WindowMinimizeIcon';
