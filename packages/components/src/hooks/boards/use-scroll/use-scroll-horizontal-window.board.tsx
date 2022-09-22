import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import {
    expectElement,
    expectElementText,
    maxScroll,
    scenarioPlugin,
    scrollAction,
} from '../../../board-plugins/scenario-plugin/scenario-plugin';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createBoard({
    name: 'use scroll window horizontal',
    Board: () => <ScrollHookSimulator isHorizontal={true} />,
    environmentProps: {
        canvasWidth: 2000,
        canvasHeight: 500,
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
