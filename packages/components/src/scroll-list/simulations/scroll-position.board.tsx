import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import React, { useState } from 'react';
import { createItems, ItemData, ItemRenderer } from '../../simulation-assets';
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

export default createBoard({
    name: 'ScrollList — scrollPosition',
    Board: () => {
        const [scrollPosition, setScrollPosition] = useState(0);

        const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
            setScrollPosition((e.target as HTMLDivElement).scrollTop);
        };

        return (
            <div style={{ height: '250px', overflow: 'auto' }} onScroll={handleScroll}>
                <ScrollList
                    scrollPosition={scrollPosition}
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
                    itemGap={20}
                />
            </div>
        );
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 300,
        windowWidth: 600,
    },
    plugins: [
        mixinProjectThemes,
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
    ],
});
