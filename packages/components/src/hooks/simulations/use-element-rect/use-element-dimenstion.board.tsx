import React, { useState } from 'react';
import { createBoard } from '@wixc3/react-board';
import { expectElementText, scenarioMixin } from '../../../simulation-mixins/scenario';
import { ElmentDimHookSimulator } from './element-rect-hook-simulator';

export default createBoard({
    name: 'use element dimenstion',
    Board: () => {
        const [render, setRender] = useState(true)
        return <div onClick={() => setRender(!render)}><button>asdasd</button>{render && <ElmentDimHookSimulator isVertical={true} watchSize={true} width="100%" height="100%" />}</div>
    },
    environmentProps: {
        canvasWidth: 746,
        canvasHeight: 378,
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
