import { createBoard } from '@wixc3/react-board';
import React from 'react';
import type { ItemData } from '../board-assets';
import { createItems, ItemRenderer } from '../board-assets';
import { projectThemesPlugin, zeeRootPlugin } from '../board-plugins';
import { AutoComplete } from './auto-complete';

const items = createItems(30000);

export default createBoard({
    name: 'auto-complete',
    Board: () => (
        <AutoComplete
            ItemRenderer={ItemRenderer}
            items={items}
            getId={(item: ItemData) => item.id}
            getTextContent={(item: ItemData) => item.title}
        />
    ),
    plugins: [projectThemesPlugin, zeeRootPlugin],
    environmentProps: {
        canvasHeight: 24,
        windowHeight: 576,
        windowWidth: 786,
    },
});
