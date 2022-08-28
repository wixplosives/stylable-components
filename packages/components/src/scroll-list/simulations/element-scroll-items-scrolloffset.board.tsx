import React, { useState, useRef, memo } from 'react';
import type { ItemData } from '../../simulation-assets/item-renderer';
import {
    scenarioMixin,
    scrollAction,
    expectElements,
    writeAction,
    expectElement,
} from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';
import type { ListItemProps } from '../../list/list';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';

const items = new Array(1000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);

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
    name: 'element-scroll-items-scrolloffset',
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
            slowMo: 300,
            events: [
                expectElements(['#offset', '[data-id="a0"]'], (els) => {
                    const rootBox = els['#offset'].getBoundingClientRect();
                    const firstItem = els['[data-id="a0"]'].getBoundingClientRect();
                    expect(Math.ceil(firstItem.top)).to.be.equal(Math.ceil(rootBox.bottom));
                }),
                expectElement(
                    '#scroll-element',
                    (el) => {
                        expect(el.getBoundingClientRect().height).to.equal(1_000 * 100 + 400);
                    },
                    'max scroll is accurate',
                    5_000
                ),
                scrollAction(-1, true, '#scroll-root', 4000),

                expectElements(['#scroll-root', '[data-id="a999"]'], (els) => {
                    const rootBox = els['#scroll-root'].getBoundingClientRect();
                    const lastItem = els['[data-id="a999"]'].getBoundingClientRect();
                    expect(Math.ceil(lastItem.bottom)).to.be.equal(Math.ceil(rootBox.bottom));
                }),
                scrollAction(0, true, '#scroll-root'),
                writeAction('#input', '123'),
                expectElement(
                    '#scroll-element',
                    (el) => {
                        expect(el.getBoundingClientRect().height).to.equal(1_000 * 100 + 123);
                    },
                    'max scroll is updated',
                    5_000
                ),
                scrollAction(-1, true, '#scroll-root'),
                expectElements(['#scroll-root', '[data-id="a999"]'], (els) => {
                    const rootBox = els['#scroll-root'].getBoundingClientRect();
                    const lastItem = els['[data-id="a999"]'].getBoundingClientRect();
                    expect(Math.ceil(lastItem.bottom)).to.be.equal(Math.ceil(rootBox.bottom));
                }),
            ],
        }),
        mixinProjectThemes,
    ],
});
