import { createBoard } from '@wixc3/react-board';
import React from 'react';
import type { ItemData } from '../board-assets';
import { createItems, ItemRenderer } from '../board-assets';
import { projectThemesPlugin } from '../board-plugins/project-themes-plugin';
import { ZeeRootPlugin } from '../board-plugins/zee-root-plugin';
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
    plugins: [ZeeRootPlugin, projectThemesPlugin],
    environmentProps: {
        canvasHeight: 24,
        windowHeight: 576,
        windowWidth: 786,
    },
});
