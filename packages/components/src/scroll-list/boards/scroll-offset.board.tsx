import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import React, { useRef, useState } from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets/index.js';
import {
    expectElement,
    expectElements,
    projectThemesPlugin,
    scenarioPlugin,
    scrollAction,
    writeAction,
} from '../../board-plugins/index.js';
import { ScrollList } from '../scroll-list.js';

const items = createItems();
const fixedItemSize = 50; // board-assets/item-renderer/item-renderer.st.css

export default createBoard({
    name: 'ScrollList — with offset',
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
                        getId={getId}
                        scrollWindow={ref}
                        itemSize={fixedItemSize}
                        itemGap={0}
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
        scenarioPlugin.use({
            title: 'should listen to offset resize',
            skip: true,
            events: [
                expectElements(['#offset', '[data-id="a0"]'], (els) => {
                    const rootBox = els['#offset'].getBoundingClientRect();
                    const firstItem = els['[data-id="a0"]'].getBoundingClientRect();
                    expect(Math.ceil(firstItem.top)).to.be.equal(Math.ceil(rootBox.bottom));
                }),
                expectElement(
                    '#scroll-element',
                    (el) => {
                        expect(el.getBoundingClientRect().height).to.equal(1_000 * fixedItemSize + 401);
                    },
                    'max scroll is accurate',
                    5_000,
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
                    5_000,
                ),
                scrollAction(-1, true, '#scroll-root'),
                expectElements(['#scroll-root', '[data-id="a999"]'], (els) => {
                    const rootBox = els['#scroll-root'].getBoundingClientRect();
                    const lastItem = els['[data-id="a999"]'].getBoundingClientRect();
                    expect(Math.ceil(lastItem.bottom)).to.be.approximately(Math.ceil(rootBox.bottom), 2);
                }),
            ],
        }),
        projectThemesPlugin,
    ],
});
