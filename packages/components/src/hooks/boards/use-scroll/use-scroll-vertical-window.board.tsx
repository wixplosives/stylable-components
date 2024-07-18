import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import React from 'react';
import { expectElement, expectElementText, maxScroll, scenarioPlugin, scrollAction } from '../../../board-plugins';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createBoard({
    Board: () => (
        <div style={{ width: '200px', height: '2000px' }}>
            <ScrollHookSimulator />
        </div>
    ),
    name: 'use scroll window vertical',
    environmentProps: {
        windowWidth: 500,
        windowHeight: 640,
    },
    plugins: [
        scenarioPlugin.use({
            events: [
                scrollAction(300),
                expectElementText('#res', '300'),
                scrollAction(200),
                expectElementText('#res', '200'),
                scrollAction(-1),
                expectElement('#res', (el: HTMLElement) => {
                    expect(Math.round(parseFloat(el.innerText))).to.equal(Math.round(maxScroll(window, true)));
                }),
                scrollAction(0),
                expectElementText('#res', '0'),
            ],
        }),
    ],
});
