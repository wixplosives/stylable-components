import { createSimulation } from '@wixc3/react-simulation';
import { IdBasedRectsHookSimulator } from './element-rect-hook-simulator';

export default createSimulation({
    componentType: IdBasedRectsHookSimulator,
    name: 'use element size',
    props: {
        watchSize: true,
        width: '100%',
        height: '100%',
        data: [{
            id: 'a',
            style: {
                background: 'blue'
            }
        },
        {
            id: 'b',
            style: {
                background: 'red',
                width: '50%'
            }
        }],
    },
    environmentProps: {
        canvasWidth: 522,
        canvasHeight: 208,
        windowWidth: 1190,
        windowHeight: 640,
    },
});
