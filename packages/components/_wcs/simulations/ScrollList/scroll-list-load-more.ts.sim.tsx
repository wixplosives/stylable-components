import { createSimulation } from '@wixc3/wcs-core';
import { ItemData, ItemRenderer } from '../common/item-renderer';
import { ScrollList } from './../../../src/scoll-list/scroll-list';

const items = new Array(1000).fill(0).map(
    (_, idx) =>
    ({
        id: 'a' + idx,
        title: 'item number ' + idx,
    } as ItemData)
);

export default createSimulation<ScrollList<ItemData, HTMLElement>>({
    name: 'scroll-list-load-more.ts',
    componentType: ScrollList,
    props: {
        ItemRenderer,
        items,
        getId: (item: ItemData) => item.id,
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 621,
    },
});
