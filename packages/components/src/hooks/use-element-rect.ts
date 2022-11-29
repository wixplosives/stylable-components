import type React from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ElementDimensions, unmeasuredDimensions } from '../common';

export const useElementDimension = (
    element?: React.RefObject<HTMLElement>,
    isVertical = true,
    watchSize: number | boolean = false
): number => {
    const [size, updateSize] = useState(
        typeof watchSize === 'number' ? watchSize : dimensionsToSize(getElementDimensions(element?.current), isVertical)
    );

    useEffect(() => {
        let observer: ResizeObserver;

        if (typeof watchSize === 'number') {
            return;
        }

        updateSize(dimensionsToSize(getElementDimensions(element?.current), isVertical));

        if (watchSize) {
            const listener = () => updateSize(dimensionsToSize(getElementDimensions(), isVertical));
            window.addEventListener('resize', listener);

            return () => {
                window.removeEventListener('resize', listener);
            };
        }

        if (element?.current) {
            observer = new ResizeObserver(() =>
                updateSize(dimensionsToSize(getElementDimensions(element.current), isVertical))
            );

            observer.observe(element.current);

            return () => {
                observer.disconnect();
            };
        }

        return undefined;
    }, [element, isVertical, watchSize]);

    return size;
};

const getElementDimensions = (element?: HTMLElement | null): ElementDimensions => {
    if (element === null) {
        return unmeasuredDimensions;
    }

    if (element === undefined) {
        return {
            height: window.innerHeight,
            width: window.innerWidth,
        };
    }

    return rectToDimensions(element.getBoundingClientRect());
};

const dimensionsToSize = (dimensions: ElementDimensions, sizeAsHeight: boolean): number => {
    return (sizeAsHeight ? dimensions.height : dimensions.width) || 0;
};

export const rectToDimensions = (rect?: DOMRect): ElementDimensions => {
    return rect
        ? {
              width: rect.width,
              height: rect.height,
          }
        : unmeasuredDimensions;
};

export const useElementSize = (
    element: React.RefObject<HTMLElement>,
    watchSize: boolean | ElementDimensions
): ElementDimensions => {
    const startRect = useMemo(() => {
        if (typeof watchSize === 'object') {
            return watchSize;
        }
        return rectToDimensions(element.current?.getBoundingClientRect());
    }, [element, watchSize]);
    const [rect, updateRect] = useState(startRect);
    useLayoutEffect(() => {
        let observer: ResizeObserver;
        updateRect(rectToDimensions(element.current?.getBoundingClientRect()));
        if (typeof watchSize === 'object') {
            return;
        }
        if (watchSize && element.current) {
            observer = new ResizeObserver(() => {
                updateRect(rectToDimensions(element.current?.getBoundingClientRect()));
            });
            observer.observe(element.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [element, watchSize]);
    return rect;
};

const noop = () => undefined;

export const useSetableObserver = (shouldMeasure: boolean) => {
    const listener = useRef<ResizeObserverCallback>(noop);
    const observerRef = useRef<ResizeObserver>();
    const observed = useRef(new Set<Element>());

    useLayoutEffect(() => {
        if (shouldMeasure) {
            observerRef.current = new ResizeObserver((ev, obs) => listener.current(ev, obs));
        }
        return () => {
            observerRef.current?.disconnect();
        };
    }, [shouldMeasure]);
    const listen = (lis: ResizeObserverCallback) => (listener.current = lis);
    const setTargets = useCallback((targets: Element[]) => {
        const newObserved = new Set<Element>();
        const observer = observerRef.current;
        if (!observer) {
            return;
        }
        for (const target of targets) {
            newObserved.add(target);
            if (!observed.current.has(target)) {
                observer.observe(target);
            }
        }
        for (const oldTarget of [...observed.current]) {
            if (!newObserved.has(oldTarget)) {
                observer.unobserve(oldTarget);
            }
        }
        observed.current = newObserved;
    }, []);
    return {
        listen,
        setTargets,
    };
};
export const createSetableMutationObserver = () => {
    let listener: MutationCallback = noop;
    const listen = (lis: MutationCallback) => (listener = lis);
    const observer = new MutationObserver((ev, obs) => listener(ev, obs));
    return {
        listen,
        observer,
    };
};
