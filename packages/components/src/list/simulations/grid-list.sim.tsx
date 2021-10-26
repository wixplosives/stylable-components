import { createSimulation } from '@wixc3/react-simulation';
import { createItems } from '../../simulation-assets/create-items';
import { ItemRenderer } from '../../simulation-assets/item-renderer';
import { List } from '../list';
interface ItemData {
    title: string;
    id: string;
}

export default createSimulation<List<ItemData>>({
    name: 'grid-list',
    componentType: List,
    props: {
        ItemRenderer,
        items: createItems(),
        getId: (item: ItemData) => item.id,
        listRoot: {
            el: 'div',
            props: {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridGap: '10px',
                },
            },
        },
    },
    environmentProps: {
        canvasWidth: 331,
        canvasHeight: 138,
    },
});
