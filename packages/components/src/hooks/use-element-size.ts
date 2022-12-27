import type React from 'react';
import { useEffect, useState } from 'react';
import { getSizeFromDimensions, getElementSize, observeElementDimensions, observeWindowDimensions } from '../common';

export const useElementSize = (element: React.RefObject<HTMLElement> | undefined, sizeAsHeight: boolean): number => {
    const [size, updateSize] = useState(getElementSize(element?.current, sizeAsHeight));

    useEffect(() => {
        const cleanup = element?.current
            ? observeElementDimensions(element.current, (dimensions) =>
                  updateSize(getSizeFromDimensions(dimensions, sizeAsHeight))
              )
            : observeWindowDimensions((dimensions) => updateSize(getSizeFromDimensions(dimensions, sizeAsHeight)));

        updateSize(getElementSize(element?.current, sizeAsHeight));

        return () => cleanup?.();
    }, [element, sizeAsHeight]);

    return size;
};
