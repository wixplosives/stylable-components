import React from 'react';
import type { ItemData } from '../../board-assets/item-renderer';
import {
    clickAction,
    expectElementsStyle,
    expectElementStyle,
    hoverAction,
    scenarioMixin,
    scrollAction,
} from '../../board-mixins/scenario';
import { ScrollList } from '../scroll-list';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { createBoard } from '@wixc3/react-board';
import { StatefullItemRenderer } from '../../board-assets/statefull-item-renderer';

const items = new Array(1000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);

export default createBoard({
    name: 'no-unmount',
    Board: () => (
        <ScrollList
            ItemRenderer={StatefullItemRenderer}
            items={items}
            getId={(item: ItemData) => item.id}
            watchScrollWindoSize={true}
            unmountItems={false}
        />
    ),
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 388,
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
