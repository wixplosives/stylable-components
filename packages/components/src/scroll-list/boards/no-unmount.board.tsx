import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, StatefulItemRenderer } from '../../board-assets';
import { projectThemesPlugin, scenarioPlugin } from '../../board-plugins';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList — no unmount',
    Board: () => (
        <ScrollList
            ItemRenderer={StatefulItemRenderer}
            items={items}
            getId={getId}
            watchScrollWindowSize={true}
            unmountItems={false}
        />
    ),
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 388,
        windowWidth: 600,
    },
    plugins: [
        scenarioPlugin.use({
            skip: true,
            events: [],
        }),
        projectThemesPlugin,
    ],
});
