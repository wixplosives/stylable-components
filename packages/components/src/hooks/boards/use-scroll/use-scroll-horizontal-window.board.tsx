import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import React from 'react';
import { expectElement, expectElementText, maxScroll, scenarioPlugin, scrollAction } from '../../../board-plugins';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createBoard({
    name: 'use scroll window horizontal',
    Board: () => (
        <div style={{ height: '200px', width: '2000px' }}>
            <ScrollHookSimulator isHorizontal={true} />
        </div>
    ),
    environmentProps: {
        windowWidth: 500,
        windowHeight: 640,
    },
    plugins: [
        scenarioPlugin.use({
            title: 'scrolls horizontally',
            events: [
                scrollAction(200, false),
                expectElementText('#res', '200'),
                scrollAction(-1, false),
                expectElement('#res', (el: HTMLElement) => {
                    expect(Math.round(parseFloat(el.innerText))).to.equal(Math.round(maxScroll(window, false)));
                }),
                scrollAction(0, false),
                expectElementText('#res', '0'),
            ],
        }),
    ],
});
