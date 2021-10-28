import { createSimulation } from '@wixc3/react-simulation';
import { ZeeRoot } from '../simulation-mixins/mixin-zee-root';
import { AutoComplete } from './auto-complete';
import { mixinProjectThemes } from '../simulation-mixins/mixin-project-themes';
import { ItemData, ItemRenderer } from '../simulation-assets/item-renderer';
import { Root } from '@zeejs/react';
import { classes } from '../themes/white.st.css';
import React from 'react';

const items = new Array(30000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);
export default createSimulation<AutoComplete<ItemData, HTMLElement>>({
    name: 'auto-complete',
    componentType: AutoComplete,
    props: {
        ItemRenderer,
        items,
        getId: (item: ItemData) => item.id,
        getTextContent: (item: ItemData) => item.title,
    },
    wrapper: ({ renderSimulation }) => {
        return (
            <div className={classes.white}>
                <Root>{renderSimulation()}</Root>
            </div>
        );
    },
    plugins: [ZeeRoot, mixinProjectThemes],
    environmentProps: {
        canvasHeight: 24,
        windowHeight: 576,
        windowWidth: 786,
    },
});
