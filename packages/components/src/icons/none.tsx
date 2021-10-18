import React, { memo } from 'react';
import type { IconProps } from './types';
import { style, classes } from './font-awesome-icon-style.st.css';

export const NoneIcon = memo<IconProps>((props) => (
    <svg {...props} className={style(classes.root, {}, props.className)} viewBox="0 0 24 24">
        <line x1="3.35355" y1="3.64645" x2="20.3536" y2="20.6464" stroke="currentColor" />
    </svg>
));

NoneIcon.displayName = 'NoneIcon';
