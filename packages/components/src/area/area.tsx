import React from 'react';
import { classes, st } from './area.st.css';

export const Area = React.forwardRef<HTMLDivElement, React.ComponentPropsWithRef<'div'>>((props, ref) => {
    return <div {...props} className={st(classes.root, props.className)} ref={ref} />;
});

Area.displayName = 'Area';
