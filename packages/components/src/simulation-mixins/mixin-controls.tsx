import { classes } from './mixin-controls.st.css';
// import React from 'react';
// import ReactDom from 'react-dom';
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
    // return ReactDom.createPortal()
    // const elements: Record<string, JSX.Element> = {};
    // let triggered: number | undefined = undefined;
    // return (element: JSX.Element) => {
    //     const id = element.key;
    //     if (!id) {
    //         throw new Error('must supply key');
    //     }
    //     elements[id] = element;
    //     if (!triggered) {
    //         triggered = setTimeout(() => {
    //             ReactDom.render(
    //                 <div>
    //                     {Object.entries(elements).map(([_key, el]) => {
    //                         return el;
    //                     })}
    //                 </div>,
    //                 existing
    //             );
    //             triggered = undefined;
    //         }, 0);
    //     }
    // };
};
