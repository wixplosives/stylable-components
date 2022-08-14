import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { expectElementText, scenarioMixin } from '../../../simulation-mixins/scenario';
import { ElmentDimHookSimulator } from './element-rect-hook-simulator';

export default createBoard({
    name: 'use element dimenstion',
    Board: () => <ElmentDimHookSimulator isVertical={true} watchSize={true} width="100%" height="100%" />,
    environmentProps: {
        canvasWidth: 746,
        canvasHeight: 372,
        windowWidth: 1190,
        windowHeight: 640,
    },
    plugins: [
        scenarioMixin.use({
            title: 'should measure elements',
            events: [expectElementText('#res', '100')],
            timeout: 4000,
        }),
    ],
});
