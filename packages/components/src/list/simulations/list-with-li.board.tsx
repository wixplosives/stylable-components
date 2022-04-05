import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { List } from '../list';

import { LIItemRenderer } from '../../simulation-assets/li-item-renderer';
interface ItemData {
    title: string;
    id: string;
}

export default createBoard({
    name: 'list-with-li',
    Board: () => (
        <List
            listRoot={{
                el: 'ul',
                props: {},
            }}
            ItemRenderer={LIItemRenderer}
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
    },
});
