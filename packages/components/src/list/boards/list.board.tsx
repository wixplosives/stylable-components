import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { ItemRenderer } from '../../board-assets/index.js';
import { List } from '../list.js';

interface ItemData {
    title: string;
    id: string;
}

export default createBoard({
    name: 'List',
    Board: () => (
        <List
            ItemRenderer={ItemRenderer}
            items={
                [
                    {
                        id: 'a',
                        title: 'item 1',
                    },
                    {
                        id: 'b',
                        title: 'item 2',
                    },
                ] as ItemData[]
            }
            getId={(item: ItemData) => item.id}
        />
    ),
    environmentProps: {
        canvasWidth: 331,
        canvasHeight: 138,
    },
});
