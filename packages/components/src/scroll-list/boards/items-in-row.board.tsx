import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import { projectThemesPlugin } from '../../board-plugins';
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
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 500,
    },
    plugins: [projectThemesPlugin],
});
