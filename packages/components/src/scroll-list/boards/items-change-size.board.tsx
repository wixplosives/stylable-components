import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, ExpandableItemRenderer, getId } from '../../board-assets';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { clickAction, expectElement, scenarioMixin } from '../../board-mixins/scenario';
import { ScrollList } from '../scroll-list';

const items = createItems();

const elementRef: React.RefObject<HTMLDivElement> = {
    current: null,
};

export default createBoard({
    name: 'ScrollList — items change size',
    Board: () => (
        <ScrollList
            ItemRenderer={ExpandableItemRenderer}
            items={items}
            getId={getId}
            watchScrollWindowSize={true}
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
            title: 'should listen to item resize',
            events: [
                clickAction('[data-id="a0"] button'),
                clickAction('[data-id="a1"] button'),
                clickAction('[data-id="a2"] button'),
                expectElement('[data-id="a5"]'),
            ],
        }),
        mixinProjectThemes,
    ],
});
