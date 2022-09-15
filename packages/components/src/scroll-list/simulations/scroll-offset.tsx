import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import React, { memo, useRef, useState } from 'react';
import type { ListItemProps } from '../../list/list';
import type { ItemData } from '../../simulation-assets';
import { createItems } from '../../simulation-assets';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import {
    expectElement,
    expectElements,
    scenarioMixin,
    scrollAction,
    writeAction,
} from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';

const items = createItems();

const ItemRenderer: React.FC<ListItemProps<ItemData>> = memo((props) => {
    const [isExpanded, setExpanded] = useState(true);
    return (
        <div
            data-id={props.id}
            style={{
                height: isExpanded ? '100px' : '12px',
                outline: '1px solid ',
            }}
        >
            <button onClick={() => setExpanded(!isExpanded)}>{isExpanded ? 'close' : 'open'}</button>
            {isExpanded && <div>{props.data.title}</div>}
        </div>
    );
});
ItemRenderer.displayName = 'ItemRenderer';

export default createBoard({
    name: 'ScrollList — scrollOffset',
    Board: () => {
        const ref = useRef<HTMLDivElement>(null);
        const [offsetHeight, setOffsetHeight] = useState(400);
        return (
            <div
                style={{
                    overflow: 'auto',
                    height: '100%',
                }}
                id="scroll-root"
                ref={ref}
            >
                <div id="scroll-element">
                    <div
                        style={{
                            height: `${offsetHeight}px`,
                        }}
                        id="offset"
                    >
                        <input
                            value={offsetHeight}
                            type="number"
                            onChange={(ev) => setOffsetHeight(parseInt(ev.target.value))}
                            id="input"
                        ></input>
                    </div>
                    <ScrollList
                        ItemRenderer={ItemRenderer}
                        items={items}
                        getId={(item: ItemData) => item.id}
                        watchScrollWindoSize={true}
                        estimatedItemSize={50}
                        scrollWindow={ref}
                        itemGap={0}
                        extraRenderedItems={0}
                        itemSize
                        scrollOffset={true}
                        listRoot={{
                            el: 'div',
                            props: {
                                style: {
                                    width: '100%',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 726,
        windowWidth: 600,
        canvasHeight: 600,
    },
    plugins: [
        scenarioMixin.use({
            title: 'should listen to offset resize',
            events: [
                expectElements(['#offset', '[data-id="a0"]'], (els) => {
                    const rootBox = els['#offset'].getBoundingClientRect();
                    const firstItem = els['[data-id="a0"]'].getBoundingClientRect();
                    expect(Math.ceil(firstItem.top)).to.be.equal(Math.ceil(rootBox.bottom));
                }),
                expectElement(
                    '#scroll-element',
                    (el) => {
                        expect(el.getBoundingClientRect().height).to.equal(1_000 * 100 + 401);
                    },
                    'max scroll is accurate',
                    5_000
                ),
                scrollAction(-1, true, '#scroll-root', 4000),

                expectElements(['#scroll-root', '[data-id="a999"]'], (els) => {
                    const rootBox = els['#scroll-root'].getBoundingClientRect();
                    const lastItem = els['[data-id="a999"]'].getBoundingClientRect();
                    expect(Math.ceil(lastItem.bottom)).to.be.approximately(Math.ceil(rootBox.bottom), 2);
                }),
                scrollAction(0, true, '#scroll-root'),
                writeAction('#input', '123'),
                expectElement(
                    '#scroll-element',
                    (el) => {
                        expect(el.getBoundingClientRect().height).to.be.approximately(1_000 * 100 + 124, 2);
                    },
                    'max scroll is updated',
                    5_000
                ),
                scrollAction(-1, true, '#scroll-root'),
                expectElements(['#scroll-root', '[data-id="a999"]'], (els) => {
                    const rootBox = els['#scroll-root'].getBoundingClientRect();
                    const lastItem = els['[data-id="a999"]'].getBoundingClientRect();
                    expect(Math.ceil(lastItem.bottom)).to.be.approximately(Math.ceil(rootBox.bottom), 2);
                }),
            ],
        }),
        mixinProjectThemes,
    ],
});
