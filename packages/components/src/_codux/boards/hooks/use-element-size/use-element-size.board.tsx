import { createBoard } from '@wixc3/react-board';
import React, { useRef } from 'react';
import { useElementSize } from '../../../../hooks/use-element-size';

export const ElementDimensionsHookSimulator = ({ height, width }: { width?: string; height?: string }) => {
    const element = useRef<HTMLDivElement>(null);
    const elementHeight = useElementSize(element, true);
    const elementWidth = useElementSize(element, false);

    return (
        <div
            style={{
                height,
                width,
                margin: 'auto',
            }}
        >
            <div
                ref={element}
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
        canvasWidth: 250,
        canvasHeight: 250,
        windowWidth: 350,
        windowHeight: 350,
    },
});
