import type React from 'react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { childrenById } from '../common/element-id-utils';
import { unchanged, useDelayedUpdateState } from './use-delayed-update';

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
    element?: React.RefObject<HTMLElement>,
    isVertical = true,
    watchSize: number | boolean = false
): number => {
    const startDim =
        typeof watchSize === 'number' ? watchSize : watchedSizeToDim(isVertical, elementOrWindowSize(element?.current));
    const [dimension, updateDimension] = useState(startDim);

    useEffect(() => {
        let observer: ResizeObserver;
        if (typeof watchSize === 'number') {
            return;
        }
        updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize(element?.current)));

        if (watchSize) {
            const listener = () => {
                updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize()));
            };
            window.addEventListener('resize', listener);
            
            return () => window.removeEventListener('resize', listener);
        }

        if (element?.current) {
            observer = new ResizeObserver(() => {
                updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize(element.current)));
            });

            observer.observe(element.current);

            return () => {
                observer.disconnect();
            };
        }

        return undefined;
    }, [element, isVertical, startDim, watchSize]);

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
const useSetableObserver = (shouldMeasure: boolean) => {
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
        () => calcUpdateSizes(ref, data, precomputed, getId, false, cache.current, {}).res,
        [data, getId, precomputed, ref]
    );
    const [sizes, updateSizes] = useState(() => calculatedSize);
    const delayedUpdateSizes = useDelayedUpdateState(updateSizes);
    const { setTargets, listen } = useSetableObserver(shouldMeasure);
    const { observer: mutationObserver, listen: mutationListener } = useMemo(createSetableMutationObserver, []);
    mutationListener(() => {
        if (observeSubtree) {
            delayedUpdateSizes(() => {
                const { changed, res } = calcUpdateSizes(
                    ref,
                    data,
                    precomputed,
                    getId,
                    true,
                    cache.current,
                    sizes,
                    setTargets
                );
                if (!changed) {
                    return unchanged;
                }
                return res;
            });
        }
    });
    useLayoutEffect(() => {
        if (ref.current && observeSubtree) {
            mutationObserver.observe(ref.current, {
                childList: true,
                subtree: true,
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
            }
        }
        delayedUpdateSizes(() => {
            const { changed, res } = calcUpdateSizes(
                ref,
                data,
                precomputed,
                getId,
                true,
                cache.current,
                sizes,
                setTargets
            );
            if (!changed) {
                return unchanged;
            }
            return res;
        });
    });

    useLayoutEffect(() => {
        if (!shouldMeasure) {
            return;
        }
        const { changed, res } = calcUpdateSizes(ref, data, precomputed, getId, true, cache.current, sizes, setTargets);
        if (changed) {
            updateSizes(res);
        }
    }, [data, precomputed, getId, shouldMeasure, size, ref, shouldWatchSize, setTargets, sizes]);
    if (!shouldMeasure) {
        return calculatedSize;
    }
    return sizes;
}

export const unMeasured: WatchedSize = {
    width: null,
    height: null,
};
export function calcUpdateSizes<T, EL extends HTMLElement>(
    ref: React.RefObject<EL>,
    data: T[],
    size: WatchedSize | ((t: T) => WatchedSize) | undefined,
    getId: (t: T) => string,
    meassure: boolean,
    sizeCache: Map<string, WatchedSize>,
    oldRes: Record<string, WatchedSize>,
    setObserveTargets?: (targets: Element[]) => void
): { changed: boolean; res: Record<string, WatchedSize> } {
    const itemSize = (item: T) => {
        if (size !== undefined) {
            return typeof size === 'function' ? size(item) : size;
        }
        return unMeasured;
    };
    if (size !== undefined || !meassure || !ref.current) {
        let changed = false;
        const res = data.reduce((acc, item) => {
            const id = getId(item);
            const itemRes = itemSize(item);
            acc[id] = itemRes;
            if (oldRes[id]?.height !== itemRes?.height || oldRes[id]?.width !== itemRes?.width) {
                changed = true;
            }
            return acc;
        }, {} as SizesById);

        return { changed, res: changed ? res : oldRes };
    }

    const elements = childrenById(ref.current);
    setObserveTargets?.(Object.values(elements));
    let changed = false;

    const res = data.reduce((acc, item) => {
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
        if (acc[id]?.height !== oldRes[id]?.height || acc[id]?.width !== oldRes[id]?.width) {
            changed = true;
        }
        if (acc[id]?.height !== oldRes[id]?.height || acc[id]?.width !== oldRes[id]?.width) {
            changed = true;
        }
        return acc;
    }, {} as SizesById);

    return { changed, res: changed ? res : oldRes };
}
