import React, { useState } from 'react';
import type { ItemData } from '../../simulation-assets/item-renderer';
import { clickAction, scenarioMixin, expectElement } from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';
import type { ListItemProps } from '../../list/list';
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

const ItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    const [isExpanded, setExpanded] = useState(true);
    return (
        <div
            data-id={props.id}
            style={{
                height: isExpanded ? '100px' : '12px',
                border: '1px solid ',
            }}
        >
            <button onClick={() => setExpanded(!isExpanded)}>{isExpanded ? 'close' : 'open'}</button>
            {isExpanded && <div>{props.data.title}</div>}
        </div>
    );
};
export default createBoard({
    name: 'element-scroll-items-change-size',
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
