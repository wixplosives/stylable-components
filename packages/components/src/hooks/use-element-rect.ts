import type React from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { childrenById } from '../common/element-id-utils';
import { useDelayedUpdateState } from './use-delayed-update';

export interface WatchedSize {
    width: null | number;
    height: null | number;
}
export interface SizesById {
    [id: string]: WatchedSize;
}

const elementOrWindowSize = (dim?: HTMLElement | null): WatchedSize => {
    if (dim === null) {
        return unMeasured;
    }

    if (dim === undefined) {
        if (typeof window === 'undefined') {
            return unMeasured;
        }

        return {
            height: window.innerHeight,
            width: window.innerWidth,
        };
    }

    return rectToSize(dim.getBoundingClientRect());
};

export const useElementDimension = (
    dim?: HTMLElement | null,
    isVertical = true,
    watchSize: number | boolean = false
): number => {
    const startDim = typeof watchSize === 'number' ? watchSize : watchedSizeToDim(isVertical, elementOrWindowSize(dim));
    const [dimension, updateDimension] = useState(startDim);
    useLayoutEffect(() => {
        let observer: ResizeObserver;
        if (typeof watchSize === 'number') {
            return;
        }
        updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize(dim)));
        if (watchSize) {
            if (!dim) {
                const listener = () => {
                    updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize()));
                };
                window.addEventListener('resize', listener);
                return () => window.removeEventListener('resize', listener);
            } else if (dim) {
                observer = new ResizeObserver(() => {
                    updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize(dim)));
                });
                observer.observe(dim);
                return () => {
                    observer.disconnect();
                };
            }
        }
        return undefined;
    }, [dim, isVertical, startDim, watchSize]);
    return dimension;
};

const watchedSizeToDim = (isVertical: boolean, size: WatchedSize): number => {
    return (isVertical ? size.height : size.width) || 0;
};

const rectToSize = (rect?: DOMRect): WatchedSize => {
    return rect
        ? {
              width: rect.width,
              height: rect.height,
          }
        : {
              width: null,
              height: null,
          };
};
const elementToSize = (element?: Element): WatchedSize => {
    const rect = element?.getBoundingClientRect();
    return rectToSize(rect);
};

export const useElementSize = (
    element: React.RefObject<HTMLElement>,
    watchSize: boolean | WatchedSize
): WatchedSize => {
    const startRect = useMemo(() => {
        if (typeof watchSize === 'object') {
            return watchSize;
        }
        return rectToSize(element.current?.getBoundingClientRect());
    }, [element, watchSize]);
    const [rect, updateRect] = useState(startRect);
    useLayoutEffect(() => {
        let observer: ResizeObserver;
        updateRect(rectToSize(element.current?.getBoundingClientRect()));
        if (typeof watchSize === 'object') {
            return;
        }
        if (watchSize && element.current) {
            observer = new ResizeObserver(() => {
                updateRect(rectToSize(element.current?.getBoundingClientRect()));
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
const createSetableObserver = () => {
    let listener: ResizeObserverCallback = noop;
    const listen = (lis: ResizeObserverCallback) => (listener = lis);
    const observer = new ResizeObserver((ev, obs) => listener(ev, obs));
    return {
        listen,
        observer,
    };
};
const createSetableMutationObserver = () => {
    let listener: MutationCallback = noop;
    const listen = (lis: MutationCallback) => (listener = lis);
    const observer = new MutationObserver((ev, obs) => listener(ev, obs));
    return {
        listen,
        observer,
    };
};
export function useIdBasedRects<T, EL extends HTMLElement>(
    ref: React.RefObject<EL>,
    data: T[],
    getId: (t: T) => string,
    size: WatchedSize | ((t: T) => WatchedSize) | boolean,
    observeSubtree = false
): SizesById {
    const shouldMeasure = typeof size === 'boolean';
    const shouldWatchSize = size === true;
    const precomputed = typeof size === 'boolean' ? undefined : size;
    const cache = useRef(new Map<string, WatchedSize>());
    const calculatedSize = useMemo(
        () => getSizes(ref, data, precomputed, getId, false, cache.current),
        [data, getId, precomputed, ref]
    );
    const [sizes, updateSizes] = useState(() => calculatedSize);
    const delayedUpdateSizes = useDelayedUpdateState(updateSizes);
    const { observer, listen } = useMemo(createSetableObserver, []);
    const { observer: mutationObserver, listen: mutationListener } = useMemo(createSetableMutationObserver, []);
    mutationListener(() => {
        if (observeSubtree) {
            delayedUpdateSizes(() => getSizes(ref, data, precomputed, getId, true, cache.current));
        }
    });
    useLayoutEffect(() => {
        if (ref.current && observeSubtree) {
            mutationObserver.observe(ref.current, {
                childList: true,
            });
        }
        return () => {
            mutationObserver.disconnect();
        };
    }, [mutationObserver, observeSubtree, ref]);
    listen((entries) => {
        for (const { target, contentRect } of entries) {
            const id = target.getAttribute('data-id');
            if (id) {
                cache.current.set(id, {
                    width: contentRect.width,
                    height: contentRect.height,
                });
                delayedUpdateSizes(() => getSizes(ref, data, precomputed, getId, true, cache.current));
            }
        }
    });
    useEffect(() => {
        return () => observer.disconnect();
    }, [observer]);

    useLayoutEffect(() => {
        if (!shouldMeasure || typeof size === 'function') {
            return;
        }
        updateSizes(getSizes(ref, data, precomputed, getId, true, cache.current));
        if (!ref?.current || shouldWatchSize === false || !observer) {
            return;
        }
        const results = childrenById(ref.current);
        for (const el of Object.values(results)) {
            observer.observe(el);
        }
    }, [data, precomputed, getId, shouldMeasure, size, ref, shouldWatchSize, observer]);
    if (!shouldMeasure) {
        return calculatedSize;
    }
    return sizes;
}

export const unMeasured: WatchedSize = {
    width: null,
    height: null,
};
export function getSizes<T, EL extends HTMLElement>(
    ref: React.RefObject<EL>,
    data: T[],
    size: WatchedSize | ((t: T) => WatchedSize) | undefined,
    getId: (t: T) => string,
    meassure: boolean,
    sizeCache: Map<string, WatchedSize>
): Record<string, WatchedSize> {
    if (typeof size === 'function') {
        return data.reduce((acc, item) => {
            acc[getId(item)] = size(item);
            return acc;
        }, {} as SizesById);
    }
    if (typeof size !== 'undefined') {
        return data.reduce((acc, item) => {
            acc[getId(item)] = size;
            return acc;
        }, {} as SizesById);
    }
    if (!meassure || !ref.current) {
        return data.reduce((acc, item) => {
            acc[getId(item)] = unMeasured;
            return acc;
        }, {} as SizesById);
    }
    const elements = childrenById(ref.current);
    return data.reduce((acc, item) => {
        const id = getId(item);
        const element = elements[id];
        const cachedSize = sizeCache.get(id);
        if (cachedSize) {
            acc[id] = cachedSize;
        } else if (element) {
            const measured = elementToSize(element);
            acc[id] = measured;
            sizeCache.set(id, measured);
        } else {
            acc[id] = unMeasured;
        }
        return acc;
    }, {} as SizesById);
}
