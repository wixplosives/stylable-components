import { classes } from './mixin-controls.st.css';
export const mixinControlsId = 'scenario-mixin-area';
export const getMixinControls = (): Element => {
    const existing = window.document.querySelector('#' + mixinControlsId);
    if (!existing) {
        const div = window.document.createElement('div');
        div.setAttribute('class', classes.root);
        div.setAttribute('id', mixinControlsId);
        window.document.body.appendChild(div);
        return div;
    }
    return existing;
};
