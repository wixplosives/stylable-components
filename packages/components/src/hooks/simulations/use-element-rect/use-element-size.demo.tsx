import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { ElementSizeHookSimulator } from './element-rect-hook-simulator';

export default createDemo({
    demo: () => <ElementSizeHookSimulator watchSize={true} width="100%" height="100%" />,
    name: 'use element size',
    environmentProps: {
        canvasWidth: 538,
        canvasHeight: 310,
        windowWidth: 1190,
        windowHeight: 640,
    },
});
