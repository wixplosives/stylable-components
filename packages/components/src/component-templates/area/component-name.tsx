import React from 'react';
import { style, classes } from './component-name.st.css';

export interface ComponentNameProps {
    className?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = (props) => {
    return <div className={style(classes.root, props.className)}>ComponentName</div>;
};
