import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { List } from '../list';

import { LIItemRenderer } from '../../simulation-assets/li-item-renderer';
interface ItemData {
    title: string;
    id: string;
}

export default createDemo<List<ItemData>>({
    name: 'list-with-li',
    demo: () => (
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
