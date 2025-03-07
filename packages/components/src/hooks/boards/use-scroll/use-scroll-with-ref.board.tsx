import { createBoard } from '@wixc3/react-board';
import { expect } from 'chai';
import React from 'react';
import {
    expectElements,
    expectElementText,
    maxScroll,
    scenarioPlugin,
    scrollAction,
} from '../../../board-plugins/index.js';
import { ScrollHookSimulator } from './scroll-hook-simulator.js';

export default createBoard({
    Board: () => <ScrollHookSimulator useWindowScroll={false} />,
    name: 'use scroll vertical with ref',
    environmentProps: {
        canvasWidth: 200,
        canvasHeight: 500,
        windowWidth: 500,
        windowHeight: 640,
    },
    plugins: [
        scenarioPlugin.use({
            title: 'should watch scroll position of element',
            events: [
                scrollAction(300, true, '#scroll-div'),
                expectElementText('#res', '300'),
                scrollAction(200, true, '#scroll-div'),
                expectElementText('#res', '200'),
                scrollAction(-1, true, '#scroll-div'),
                expectElements(['#res', '#scroll-div'], (elements) => {
                    expect(Math.round(parseFloat((elements['#res'] as HTMLElement).innerText))).to.equal(
                        Math.round(maxScroll(elements['#scroll-div'], true)),
                    );
                }),
                scrollAction(0, true, '#scroll-div'),
            ],
        }),
    ],
});
