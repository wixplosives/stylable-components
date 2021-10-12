import React from 'react';
import { st, classes } from './area.st.css';
export const Area = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} className={st(classes.root, props.className)} />;
};
