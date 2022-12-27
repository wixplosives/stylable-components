import type React from 'react';
import { useEffect, useState } from 'react';
import { dimensionsToSize, getElementSize, observeElementDimensions, observeWindowDimensions } from '../common';

export const useElementSize = (element?: React.RefObject<HTMLElement>, isVertical = true): number => {
    const [size, updateSize] = useState(getElementSize(element?.current, isVertical));

    useEffect(() => {
        const cleanup = element?.current
            ? observeElementDimensions(element.current, (dimensions) =>
                  updateSize(dimensionsToSize(dimensions, isVertical))
              )
            : observeWindowDimensions((dimensions) => updateSize(dimensionsToSize(dimensions, isVertical)));

        updateSize(getElementSize(element?.current, isVertical));

        return () => cleanup?.();
    }, [element, isVertical]);

    return size;
};
