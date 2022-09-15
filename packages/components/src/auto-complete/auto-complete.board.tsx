import { createBoard } from '@wixc3/react-board';
import React from 'react';
import type { ItemData } from '../board-assets';
import { createItems, ItemRenderer } from '../board-assets';
import { mixinProjectThemes } from '../board-mixins/mixin-project-themes';
import { ZeeRoot } from '../board-mixins/mixin-zee-root';
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
    plugins: [ZeeRoot, mixinProjectThemes],
    environmentProps: {
        canvasHeight: 24,
        windowHeight: 576,
        windowWidth: 786,
    },
});
