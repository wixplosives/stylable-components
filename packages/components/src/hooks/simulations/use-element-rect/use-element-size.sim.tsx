import { createSimulation } from '@wixc3/react-simulation';
import { ElementSizeHookSimulator } from './element-rect-hook-simulator';

export default createSimulation({
    componentType: ElementSizeHookSimulator,
    name: 'use element size',
    props: {
        watchSize: true,
        width: '100%',
        height: '100%',
    },
    environmentProps: {
        canvasWidth: 396,
        canvasHeight: 310,
        windowWidth: 1190,
        windowHeight: 640,
    },
});
