import { createSimulation } from '@wixc3/react-simulation';
import { ItemRenderer } from '../../simulation-assets/item-renderer';
import { List } from '../list';
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
        canvasHeight: 138,
    },
});
