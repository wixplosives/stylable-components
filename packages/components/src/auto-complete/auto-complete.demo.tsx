import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { ZeeRoot } from '../simulation-mixins/mixin-zee-root';
import { AutoComplete } from './auto-complete';
import { mixinProjectThemes } from '../simulation-mixins/mixin-project-themes';
import { ItemData, ItemRenderer } from '../simulation-assets/item-renderer';

const items = new Array(30000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);
export default createDemo<AutoComplete<ItemData, HTMLElement>>({
    name: 'auto-complete',
    demo: () => (
        <AutoComplete
            ItemRenderer={ItemRenderer}
            items={items}
            getId={(item: ItemData) => item.id}
            getTextContent={(item: ItemData) => item.title}
        />
    ),
    plugins: [ZeeRoot, mixinProjectThemes],
    environmentProps: {
        canvasHeight: 24,
        windowHeight: 576,
        windowWidth: 786,
    },
});
