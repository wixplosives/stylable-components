import React from 'react';
import ReactDOM from 'react-dom';
import { classes } from './mixin-controls.st.css';

export const mixinControlsId = 'scenario-mixin-area';

export const getMixinControls = () => {
    let existing = window.document.querySelector('#' + mixinControlsId);

    if (!existing) {
        existing = window.document.createElement('div');
        existing.setAttribute('class', classes.root);
        existing.setAttribute('id', mixinControlsId);

        window.document.body.appendChild(existing);
    }

    return existing;
};

export const renderInMixinControls = (demo: JSX.Element, mixinControls: JSX.Element, key: string) => {
    const el = getMixinControls();

    return (
        <>
            {demo}
            {ReactDOM.createPortal(mixinControls, el, key)}
        </>
    );
};
