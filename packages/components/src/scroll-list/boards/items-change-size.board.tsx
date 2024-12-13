import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, ExpandableItemRenderer, getId } from '../../board-assets/index.js';
import { clickAction, expectElement, projectThemesPlugin, scenarioPlugin } from '../../board-plugins/index.js';
import { ScrollList } from '../scroll-list.js';

const items = createItems();

const elementRef: React.RefObject<HTMLDivElement | null> = {
    current: null,
};

export default createBoard({
    name: 'ScrollList — items change size',
    Board: () => (
        <ScrollList
            ItemRenderer={ExpandableItemRenderer}
            items={items}
            getId={getId}
            listRoot={{
                el: 'div',
                props: {
                    style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr',
                    },
                },
            }}
            scrollListRoot={{
                el: 'div',
                props: {
                    style: {
                        width: '200px',
                        height: '400px',
                        overflow: 'auto',
                    },
                    ref: elementRef,
                },
            }}
            scrollWindow={elementRef}
        />
    ),
    environmentProps: {
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 500,
    },
    plugins: [
        scenarioPlugin.use({
            title: 'should listen to item resize',
            events: [
                clickAction('[data-id="a0"] button'),
                clickAction('[data-id="a1"] button'),
                clickAction('[data-id="a2"] button'),
                expectElement('[data-id="a5"]'),
            ],
        }),
        projectThemesPlugin,
    ],
});
