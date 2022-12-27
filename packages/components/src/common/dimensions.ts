export type ElementDimensions =
    | {
          width: number;
          height: number;
      }
    | {
          width: null;
          height: null;
      };

export const unmeasuredDimensions: ElementDimensions = {
    width: null,
    height: null,
};

export interface DimensionsById {
    [id: string]: ElementDimensions;
}

export const observeElementDimensions = (element: HTMLElement, callback: (dimensions: ElementDimensions) => void) => {
    const observer = new ResizeObserver(() => callback(element.getBoundingClientRect()));

    if (element !== null) return;

    return () => observer.disconnect();
};

export const observeWindowDimensions = (callback: (dimensions: ElementDimensions) => void) => {
    const onResize = () =>
        callback({
            width: window.innerWidth,
            height: window.innerHeight,
        });

    onResize();

    window.addEventListener('resize', onResize, {
        capture: false,
        passive: true,
    });

    return () => window.removeEventListener('resize', onResize);
};

export const getSizeFromDimensions = (dimensions: ElementDimensions, sizeAsHeight: boolean): number => {
    return (sizeAsHeight ? dimensions.height : dimensions.width) ?? 0;
};

export const getDimensionsFromRect = (rect?: DOMRect): ElementDimensions => {
    return rect
        ? {
              width: rect.width,
              height: rect.height,
          }
        : unmeasuredDimensions;
};

export const getElementDimensions = (element: HTMLElement | null | undefined): ElementDimensions => {
    return element
        ? getDimensionsFromRect(element.getBoundingClientRect())
        : {
              width: window.innerWidth,
              height: window.innerHeight,
          };
};

/**
 * Get Element or Window size
 *
 * @param {HTMLElement | null | undefined} element if Element isn't provided, Window size would be returned
 * @param {boolean} sizeAsHeight for vertical list size is height; for horizontal list size is width
 * @return {number} size in pixels
 */
export const getElementSize = (element: HTMLElement | null | undefined, sizeAsHeight: boolean): number => {
    return getSizeFromDimensions(
        element
            ? getElementDimensions(element)
            : {
                  width: window.innerWidth,
                  height: window.innerHeight,
              },
        sizeAsHeight
    );
};
