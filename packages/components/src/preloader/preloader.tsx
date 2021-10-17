import React from 'react';
import { classes, st } from './preloader.st.css';
export interface PreloaderProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * @min 0
     * @max 1
     * if not supplied the preloader will show recurring animation
     */
    progress?: number;
}

export const Preloader: React.FC<PreloaderProps> = (props) => {
    const { progress: _progress, children, className, ...divProps } = props;

    // console.log(className)
    return (
        <div {...divProps} className={st(classes.root, className)}>
            <div className={st(classes.inner)}></div>
            {children}
        </div>
    );
};
