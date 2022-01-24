import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { expectElementText, scenarioMixin } from '../../../board-mixins/scenario';
import { ElmentDimHookSimulator } from './element-rect-hook-simulator';

export default createBoard({
    Board: () => <ElmentDimHookSimulator watchSize={true} width={'100%'} height={'100%'} isVertical={true} />,
    name: 'use element dimension',
    environmentProps: {
        canvasWidth: 746,
        canvasHeight: 372,
        windowWidth: 1190,
        windowHeight: 640,
    },
    plugins: [
        scenarioMixin.use({
            events: [expectElementText('#res', '100')],
            timeout: 4000,
        }),
    ],
});
