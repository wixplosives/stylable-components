import React, { FC } from 'react';
import { style, classes } from './new-component.st.css';

export type NewComponentProps = React.HTMLAttributes<HTMLDivElement>;

export const NewComponent: FC<NewComponentProps> = (props) => {
    return <div {...props} className={style(classes.root, props.className)} />;
};
