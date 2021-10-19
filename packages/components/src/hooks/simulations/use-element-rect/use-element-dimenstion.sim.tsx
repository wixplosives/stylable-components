import { createSimulation } from '@wixc3/react-simulation';
import { ElmentDimHookSimulator } from './element-rect-hook-simulator';

export default createSimulation({
    componentType: ElmentDimHookSimulator,
    name: 'use element dimenstion',
    props: {
        watchSize: true,
        width: '100%',
        height: '100%',
    },
    environmentProps: {
        canvasWidth: 746,
        canvasHeight: 372,
        windowWidth: 1190,
        windowHeight: 640,
    },
});
