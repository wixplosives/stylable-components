import React from 'react';
import { st, classes } from './area.st.css';
export const Area: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return <div {...props} className={st(classes.root, props.className)} />;
};
