import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, StatefulItemRenderer } from '../../simulation-assets';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import {
    clickAction,
    expectElementsStyle,
    expectElementStyle,
    hoverAction,
    scenarioMixin,
    scrollAction,
} from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList — no unmount',
    Board: () => (
        <ScrollList
            ItemRenderer={StatefulItemRenderer}
            items={items}
            getId={getId}
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
