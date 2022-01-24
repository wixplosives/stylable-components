import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import {
    expectElement,
    expectElementText,
    maxScroll,
    scenarioMixin,
    scrollAction,
} from '../../../board-mixins/scenario';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createBoard({
    Board: () => <ScrollHookSimulator isHorizontal={true} />,
    name: 'use scroll window horizontal',
    environmentProps: {
        canvasWidth: 2000,
        canvasHeight: 500,
        windowWidth: 500,
        windowHeight: 640,
    },
    plugins: [
        scenarioMixin.use({
            title: 'scrolls horiontaly',
            skip: true,
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
            timeout: 3000,
        }),
    ],
});
