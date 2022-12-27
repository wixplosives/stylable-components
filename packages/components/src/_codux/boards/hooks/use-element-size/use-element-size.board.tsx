import { createBoard } from '@wixc3/react-board';
import React, { useRef } from 'react';
import { useElementSize } from '../../../../hooks/use-element-size';

export const ElementDimensionsHookSimulator = ({ height, width }: { width?: string; height?: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    const elementHeight = useElementSize(ref, true);
    const elementWidth = useElementSize(ref, false);

    return (
        <div
            style={{
                height,
                width,
                margin: 'auto',
            }}
        >
            <div
                ref={ref}
                style={{
                    width: '100%',
                    height: '100%',
                    background: 'red',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div>
                    <div>Height: {elementHeight}px</div>
                    <div>Width: {elementWidth}px</div>
                </div>
            </div>
        </div>
    );
};

export default createBoard({
    name: 'Hook: use-element-size',
    Board: () => <ElementDimensionsHookSimulator width="100%" height="100%" />,
    environmentProps: {
        canvasWidth: 500,
        canvasHeight: 300,
        windowWidth: 600,
        windowHeight: 400,
    },
});
