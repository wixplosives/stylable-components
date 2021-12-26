import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { IdBasedRectsHookSimulator } from './element-rect-hook-simulator';

export default createDemo({
    name: 'use element size',
    demo: () => <IdBasedRectsHookSimulator watchSize={true} width="100%" height="100%" />,
    environmentProps: {
        canvasWidth: 448,
        canvasHeight: 208,
        windowWidth: 1190,
        windowHeight: 600,
    },
});
