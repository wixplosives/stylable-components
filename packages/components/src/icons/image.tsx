import React, { memo } from 'react';
import type { IconProps } from '../types';
import { style, classes } from './icon.st.css';

export const ImageIcon = memo<IconProps>((props) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        {...props}
        className={style(classes.root, {}, props.className)}
    >
        <path
            fill="#9F74B3"
            d="M21.3 17.2c1 0 1.8-.8 1.8-1.8s-.8-1.8-1.8-1.8-1.8.8-1.8 1.8.8 1.8 1.8 1.8zm-11.1-5.5v12.4h15.3V11.7H10.2zm.7.7h13.9v10.8l-3.6-4.1-2.2 2.6-4.4-4.7-3.7 4.6v-9.2zm9.8-4.5H6.5v10.8h1.9V9.6h12.3V7.9z"
        />
    </svg>
));

ImageIcon.displayName = 'ImageIcon';
