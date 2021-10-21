import React from 'react';
import { st, classes } from './button.st.css';
export const Button: React.FC<React.HTMLAttributes<HTMLButtonElement>> = (
    props: React.HTMLAttributes<HTMLButtonElement>
) => {
    return <button {...props} className={st(classes.root, props.className)}></button>;
};
