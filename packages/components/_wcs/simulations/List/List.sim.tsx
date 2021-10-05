import { createSimulation } from '@wixc3/wcs-core';
import { List } from './../../../src/list/list';
import { ItemRenderer } from '../common/item-renderer';
interface ItemData {
    title: string;
    id: string;
}

export default createSimulation<List<ItemData>>({
    name: 'List',
    componentType: List,
    props: {
        ItemRenderer,
        items: [
            {
                id: 'a',
                title: 'item 1',
            },
            {
                id: 'b',
                title: 'item 2',
            },
        ] as ItemData[],
        getId: (item: ItemData) => item.id,
    },
    environmentProps: {
        canvasWidth: 331,
    },
});
