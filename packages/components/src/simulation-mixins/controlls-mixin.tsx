import { createPlugin } from '@wixc3/simulation-core';
import type { IReactSimulation } from '@wixc3/react-simulation';
import { classes } from './controls-mixin.st.css';
import React from 'react';
import { getMixinControls } from './mixin-controls';
import ReactDom from 'react-dom';

export interface ControllProps {
    controls: JSX.Element[];
}

export const Controls = ({ children }: { children: JSX.Element[] }) => {
    return <div className={classes.root}>{children}</div>;
};

export const ControlsMixin = createPlugin<IReactSimulation>()(
    'controls',
    {
        controls: [],
    } as ControllProps,
    {
        wrapRender({ controls }, _r, demo) {
            const el = getMixinControls();

            return (
                <>
                    {demo}
                    {ReactDom.createPortal(<Controls key="controls">{controls}</Controls>, el, 'controls')}
                </>
            );
        },
    }
);
