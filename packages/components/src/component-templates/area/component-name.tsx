import React from 'react';
import { style, classes } from './component-name.st.css';

export const ComponentName: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return (
        <div {...props} className={style(classes.root, props.className)}>
            ComponentName
        </div>
    );
};
