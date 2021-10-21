import React from 'react';
import { st, classes } from './new-component.st.css';
export const NewComponent: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
    return <div {...props} className={st(classes.root, props.className)} />;
};
