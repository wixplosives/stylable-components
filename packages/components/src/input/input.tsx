import React from 'react';
import { st, classes } from './input.st.css';
export const Input: React.FC<React.HTMLAttributes<HTMLInputElement>> = (
    props: React.HTMLAttributes<HTMLInputElement>
) => {
    return <input {...props} className={st(classes.root, props.className)} />;
};
