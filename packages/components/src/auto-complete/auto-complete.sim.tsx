import { createSimulation } from '@wixc3/wcs-core';
import { ZeeRoot } from '../simulation-mixins/mixin-zee-root';
import { AutoComplete } from './auto-complete';
import { mixinProjectThemes } from '../simulation-mixins/mixin-project-themes';
import { ItemData, ItemRenderer } from '../simulation-assets/item-renderer';

const items = new Array(30).fill(0).map(
    (_, idx) =>
    ({
        id: 'a' + idx,
        title: 'item number ' + idx,
    } as ItemData)
);
export default createSimulation<AutoComplete<ItemData, HTMLElement>>({
    name: 'auto-complete',
    componentType: AutoComplete,
    props: {
        ItemRenderer,
        items,
        getId: (item: ItemData) => item.id,
        getTextContent: (item: ItemData) => item.title,
    },
    plugins: [ZeeRoot, mixinProjectThemes],
    environmentProps: {
        canvasHeight: 22,
        windowHeight: 572,
    },
});
