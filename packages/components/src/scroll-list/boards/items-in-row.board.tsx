import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import { projectThemesPlugin, scenarioPlugin } from '../../board-plugins';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList — items in row',
    Board: () => (
        <ScrollList
            ItemRenderer={ItemRenderer}
            items={items}
            getId={getId}
            watchScrollWindowSize={true}
            listRoot={{
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gridGap: '50px',
                    },
                },
            }}
            scrollListRoot={{
                props: {
                    style: {
                        height: '100%',
                    },
                },
            }}
            itemGap={50}
            itemsInRow={3}
        />
    ),
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 300,
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
