import React, { useState } from 'react';
import { createBoard } from '@wixc3/react-board';
import { expectElementText, scenarioPlugin } from '../../../board-plugins';
import { ElmentDimHookSimulator } from './element-rect-hook-simulator';

export default createBoard({
    name: 'use element dimension',
    Board: () => {
        const [render, setRender] = useState(true);
        return (
            <div onClick={() => setRender(!render)}>
                <button>asdasd</button>
                {render && <ElmentDimHookSimulator isVertical={true} watchSize={true} width="100%" height="100%" />}
            </div>
        );
    },
    environmentProps: {
        canvasWidth: 746,
        canvasHeight: 378,
        windowWidth: 1190,
        windowHeight: 640,
    },
    plugins: [
        scenarioPlugin.use({
            title: 'should measure elements',
            events: [expectElementText('#res', '100', 'expect measure text to equal 100', 4000)],
        }),
    ],
});
