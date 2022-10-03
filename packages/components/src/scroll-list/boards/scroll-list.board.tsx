import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import { projectThemesPlugin } from '../../board-plugins';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList',
    Board: () => (
        <ScrollList
            ItemRenderer={ItemRenderer}
            items={items}
            getId={getId}
            watchScrollWindoSize={true}
            listRoot={{
                el: 'div',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gridGap: '20px',
                    },
                },
            }}
            itemGap={20}
        />
    ),
    environmentProps: {
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 500,
    },
    plugins: [projectThemesPlugin],
});
