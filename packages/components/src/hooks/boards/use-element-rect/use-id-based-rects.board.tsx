import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { IdBasedRectsHookSimulator } from './element-rect-hook-simulator';

export default createBoard({
    Board: () => <IdBasedRectsHookSimulator watchSize={true} width={'100%'} height={'100%'} />,
    name: 'use element size',
    environmentProps: {
        canvasWidth: 448,
        canvasHeight: 208,
        windowWidth: 1190,
        windowHeight: 600,
    },
});
