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

export default createBoard({
    name: 'many-in-row',
    Board: () => (
        <ScrollList
            ItemRenderer={ItemRenderer}
            items={items}
            getId={(item: ItemData) => item.id}
            watchScrollWindowSize={true}
            listRoot={{
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gridGap: '50px',
                    },
                },
            }}
            scrollListRoot={{
                props: {
                    style: {
                        height: '100%',
                    },
                },
            }}
            itemGap={50}
            itemsInRow={3}
        />
    ),
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
