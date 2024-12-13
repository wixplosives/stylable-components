import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets/index.js';
import {
    clickAction,
    expectElementsStyle,
    expectElementStyle,
    hoverAction,
    projectThemesPlugin,
    scenarioPlugin,
    scrollAction,
} from '../../board-plugins/index.js';
import { ScrollList } from '../scroll-list.js';

const items = createItems();

export default createBoard({
    name: 'ScrollList — items in row',
    Board: () => (
        <ScrollList
            ItemRenderer={ItemRenderer}
            items={items}
            getId={getId}
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
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 500,
    },
    plugins: [
        scenarioPlugin.use({
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
        projectThemesPlugin,
    ],
});
