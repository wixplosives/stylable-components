import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { expect } from 'chai';
import {
    expectElements,
    expectElementText,
    maxScroll,
    scenarioMixin,
    scrollAction,
} from '../../../simulation-mixins/scenario';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createDemo({
    demo: () => <ScrollHookSimulator useWindowScroll={false} />,
    name: 'use scroll vertical with ref',
    environmentProps: {
        canvasWidth: 200,
        canvasHeight: 500,
        windowWidth: 500,
        windowHeight: 640,
    },
    plugins: [
        scenarioMixin.use({
            events: [
                scrollAction(300, true, '#scroll-div'),
                expectElementText('#res', '300'),
                scrollAction(200, true, '#scroll-div'),
                expectElementText('#res', '200'),
                scrollAction(-1, true, '#scroll-div'),
                expectElements(['#res', '#scroll-div'], (elements) => {
                    expect(Math.round(parseFloat((elements['#res'] as HTMLElement).innerText))).to.equal(
                        Math.round(maxScroll(elements['#scroll-div'], true))
                    );
                }),
                scrollAction(0, true, '#scroll-div'),
            ],
            timeout: 4000,
        }),
    ],
});
