import React, { memo } from 'react';
import type { IconProps } from './types';
import { classes, st } from './icon.st.css';

export const IconFactory = (icon: JSX.Element, displayName: string, width = 18, height = 18) => {
    const Comp = memo<IconProps>((props) => (
        <svg viewBox={`0 0 ${width} ${height}`} {...props} className={st(classes.root, props.className)}>
            {icon}
        </svg>
    ));
    Comp.displayName = displayName;
    return Comp;
};
