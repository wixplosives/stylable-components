import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import {
    clickAction,
    expectElementsStyle,
    expectElementStyle,
    hoverAction,
    scenarioMixin,
    scrollAction,
} from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { createSimulation } from '@wixc3/react-simulation';

const items = new Array(1000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);

export default createSimulation<ScrollList<ItemData, HTMLElement>>({
    name: 'many-in-row',
    componentType: ScrollList,
    props: {
        ItemRenderer,
        items,
        getId: (item: ItemData) => item.id,
        watchScrollWindoSize: true,
        listRoot: {
            el: 'div',
            props: {
                style: {
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gridGap: '50px',
                },
            },
        },
        itemGap: 50,
        itemsInRow: 3,
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 300,
        windowWidth: 600,
    },
    plugins: [
        scenarioMixin.use({
            skip: true,
            events: [
                hoverAction('[data-id="a8"]'),
                expectElementStyle('[data-id="a8"]', {
                    color: 'rgb(0, 0, 255)',
                }),
                hoverAction('[data-id="a9"]'),
                expectElementsStyle({
                    '[data-id="a8"]': {
                        color: 'rgb(0, 0, 0)',
                    },
                    '[data-id="a9"]': {
                        color: 'rgb(0, 0, 255)',
                    },
                }),
                clickAction('[data-id="a9"]'),
                expectElementStyle('[data-id="a9"]', {
                    backgroundColor: 'rgb(0, 0, 255)',
                }),
                clickAction('[data-id="a11"]'),
                scrollAction(-1),
                scrollAction(0),
            ],
        }),
        mixinProjectThemes,
    ],
});
