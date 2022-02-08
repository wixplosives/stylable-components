import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { ElementSizeHookSimulator } from './element-rect-hook-simulator';

export default createBoard({
    name: 'use element size',
    Board: () => <ElementSizeHookSimulator watchSize={true} width="100%" height="100%" />,
    environmentProps: {
        canvasWidth: 538,
        canvasHeight: 310,
        windowWidth: 1190,
        windowHeight: 640,
    },
});
