import { createBoard } from '@wixc3/react-board';
import React, { useRef } from 'react';
import { useElementSize } from '../';
import { ElementDimensions, unMeasured } from '../../common';

export const ElementDimensionsHookSimulator = ({
    watchSize = unMeasured,
    height,
    width,
}: {
    watchSize?: ElementDimensions | boolean;
    width?: string;
    height?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const res = useElementSize(ref, watchSize);

    return (
        <div
            style={{
                height,
                width,
            }}
        >
            <div ref={ref} style={{ width: '100%', height: '100%', background: 'red' }}>
                <div style={{ position: 'fixed', top: '50%', left: '50%' }}>
                    <div>width: {res.width}px</div>
                    <div>height: {res.height}px</div>
                </div>
            </div>
        </div>
    );
};

export default createBoard({
    name: 'use element size',
    Board: () => <ElementDimensionsHookSimulator watchSize={true} width="100%" height="100%" />,
    environmentProps: {
        canvasWidth: 500,
        canvasHeight: 300,
        windowWidth: 600,
        windowHeight: 400,
    },
});
