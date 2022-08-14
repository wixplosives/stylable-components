import React from 'react';
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
import { createBoard } from '@wixc3/react-board';
const items = new Array(1000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);
const elementRef: React.RefObject<HTMLDivElement> = {
    current: null,
};
export default createBoard({
    name: 'element-scroll',
    Board: () => (
        <ScrollList
            ItemRenderer={ItemRenderer}
            items={items}
            getId={(item: ItemData) => item.id}
            watchScrollWindoSize={true}
            listRoot={{
                el: 'div',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                        gridGap: '20px',
                    },
                },
            }}
            scrollListRoot={{
                el: 'div',
                props: {
                    id: 'list',

                    style: {
                        width: '200px',
                        height: '400px',
                        overflow: 'auto',
                    },
                    ref: elementRef,
                },
            }}
            scrollWindow={elementRef}
            itemGap={20}
        />
    ),
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 726,
        windowWidth: 600,
    },
    plugins: [
        scenarioMixin.use({
            title: 'scroll list sanity',
            events: [
                hoverAction('[data-id="a8"]'),
                expectElementStyle('[data-id="a8"]', {
                    backgroundColor: 'rgb(173, 216, 230)',
                }),
                hoverAction('[data-id="a9"]'),
                expectElementsStyle({
                    '[data-id="a8"]': {
                        backgroundColor: 'none',
                    },
                    '[data-id="a9"]': {
                        backgroundColor: 'rgb(173, 216, 230)',
                    },
                }),
                clickAction('[data-id="a9"]'),
                expectElementStyle('[data-id="a9"]', {
                    backgroundColor: 'rgb(173, 216, 230)',
                }),
                clickAction('[data-id="a11"]'),
                scrollAction(-1, true, '#list'),
                scrollAction(0, true, '#list'),
            ],
        }),
        mixinProjectThemes,
    ],
});
