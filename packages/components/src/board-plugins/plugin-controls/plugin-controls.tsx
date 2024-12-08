import React from 'react';
import ReactDOM from 'react-dom';
import { classes } from './plugin-controls.st.css';

export const pluginControlsId = 'plugin-controls-area';

export const getPluginControls = () => {
    let existing = window.document.querySelector('#' + pluginControlsId);

    if (!existing) {
        existing = window.document.createElement('div');
        existing.setAttribute('class', classes.root);
        existing.setAttribute('id', pluginControlsId);

        window.document.body.appendChild(existing);
    }

    return existing;
};

export const renderInPluginControls = (board: React.ReactElement, pluginControls: React.ReactElement, key: string) => {
    const el = getPluginControls();

    return (
        <>
            {board}
            {ReactDOM.createPortal(pluginControls, el, key)}
        </>
    );
};
