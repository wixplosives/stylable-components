import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import {
    clickAction,
    expectElement,
    expectElementsStyle,
    expectElementStyle,
    hoverAction,
    projectThemesPlugin,
    scenarioPlugin,
    scrollAction,
} from '../../board-plugins';
import { ScrollList } from '../scroll-list';

const items = createItems();

const elementRef: React.RefObject<HTMLDivElement> = {
    current: null,
};

export default createBoard({
    name: 'ScrollList — with scroll Ref',
    Board: () => (
        <ScrollList
            ItemRenderer={ItemRenderer}
            items={items}
            getId={getId}
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
        scenarioPlugin.use({
            title: 'scroll list sanity',
            events: [
                expectElement('[data-id="a3"]'),
                hoverAction('[data-id="a3"]'),
                expectElementStyle('[data-id="a3"]', {
                    backgroundColor: 'rgb(173, 216, 230)',
                }),
                hoverAction('[data-id="a4"]'),
                expectElementsStyle({
                    '[data-id="a3"]': {
                        backgroundColor: 'none',
                    },
                    '[data-id="a4"]': {
                        backgroundColor: 'rgb(173, 216, 230)',
                    },
                }),
                clickAction('[data-id="a4"]'),
                expectElementStyle('[data-id="a4"]', {
                    backgroundColor: 'rgb(173, 216, 230)',
                }),
                scrollAction(-1, true, '#list'),
                expectElement('[data-id="a999"]'),
                scrollAction(0, true, '#list'),
                expectElementStyle('[data-id="a4"]', {
                    backgroundColor: 'rgb(173, 216, 230)',
                }),
            ],
        }),
        projectThemesPlugin,
    ],
});
