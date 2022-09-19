import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, ItemData, ItemRenderer } from '../../board-assets';
import { List } from '../list';

const items = createItems(100);

export default createBoard({
    name: 'grid-list',
    Board: () => (
        <List
            ItemRenderer={ItemRenderer}
            items={items}
            getId={(item: ItemData) => item.id}
            listRoot={{
                el: 'div',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gridGap: '10px',
                    },
                },
            }}
        />
    ),
    environmentProps: {
        canvasWidth: 331,
        canvasHeight: 138,
    },
});
