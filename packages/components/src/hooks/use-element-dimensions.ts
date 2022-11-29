import React, { MutableRefObject, useCallback, useLayoutEffect, useMemo, useRef } from 'react';
import { childrenById, DimensionsById, ElementDimensions, unmeasuredDimensions } from '../common';
import {
    createSetableMutationObserver,
    rectToDimensions,
    unchanged,
    useDelayedUpdateState,
    useSetableObserver,
} from '../hooks';

const elementDimensions = (element?: Element): ElementDimensions => {
    const rect = element?.getBoundingClientRect();

    return rectToDimensions(rect);
};

const calculateDimensions = <T, EL extends HTMLElement>(
    ref: React.RefObject<EL>,
    items: T[],
    size: ElementDimensions | ((t: T) => ElementDimensions) | undefined,
    getId: (t: T) => string,
    measure: boolean,
    sizeCache: Map<string, ElementDimensions>,
    oldRes: Record<string, ElementDimensions>,
    setObserveTargets?: (targets: Element[]) => void
): { changed: boolean; res: Record<string, ElementDimensions> } => {
    const getDimensions = (item: T) => {
        if (size !== undefined) {
            return typeof size === 'function' ? size(item) : size;
        }
        return unmeasuredDimensions;
    };

    if (size !== undefined || !measure || !ref.current) {
        let changed = false;
        const res = items.reduce((acc, item) => {
            const id = getId(item);
            const itemDimensions = getDimensions(item);

            acc[id] = itemDimensions;
            if (oldRes[id]?.height !== itemDimensions?.height || oldRes[id]?.width !== itemDimensions?.width) {
                changed = true;
            }

            return acc;
        }, {} as DimensionsById);

        return {
            changed,
            res: changed ? res : oldRes,
        };
    }

    const elements = childrenById(ref.current);
    let changed = false;

    setObserveTargets?.(Object.values(elements));

    const res = items.reduce((acc, item) => {
        const id = getId(item);
        const element = elements[id];
        const cachedSize = sizeCache.get(id);

        if (cachedSize) {
            acc[id] = cachedSize;
        } else if (element) {
            const measured = elementDimensions(element);

            acc[id] = measured;
            sizeCache.set(id, measured);
        } else {
            acc[id] = unmeasuredDimensions;
        }

        if (acc[id]?.height !== oldRes[id]?.height || acc[id]?.width !== oldRes[id]?.width) {
            changed = true;
        }

        return acc;
    }, {} as DimensionsById);

    return {
        changed,
        res: changed ? res : oldRes,
    };
};

export const useElementDimensions = <T, EL extends HTMLElement>(
    ref: React.RefObject<EL>,
    items: T[],
    getId: (item: T) => string,
    getItemDimensions: false | ElementDimensions | ((item: T) => ElementDimensions),
    observeSubtree = false
): MutableRefObject<DimensionsById> => {
    const shouldMeasure = getItemDimensions === false;
    const preMeasured = typeof getItemDimensions === 'boolean' ? undefined : getItemDimensions;
    const cache = useRef(new Map<string, ElementDimensions>());
    const calculatedSize = useMemo(
        () => calculateDimensions(ref, items, preMeasured, getId, false, cache.current, {}).res,
        [getId, items, preMeasured, ref]
    );
    const unMeasuredDimensions = useRef(calculatedSize);
    const dimensions = useRef(calculatedSize);
    const updateDimensions = useCallback((newDimensions: Record<string, ElementDimensions>) => {
        for (const item in newDimensions) {
            dimensions.current[item] = newDimensions[item]!;
        }
    }, []);
    const delayedUpdateSizes = useDelayedUpdateState(updateDimensions);
    const { setTargets, listen } = useSetableObserver(shouldMeasure);
    const { observer: mutationObserver, listen: mutationListener } = useMemo(createSetableMutationObserver, []);

    const triggerDelayedUpdateSizes = useCallback(
        () =>
            delayedUpdateSizes(() => {
                const { changed, res } = calculateDimensions(
                    ref,
                    items,
                    preMeasured,
                    getId,
                    true,
                    cache.current,
                    dimensions.current,
                    setTargets
                );

                if (!changed) {
                    return unchanged;
                }

                return res;
            }),
        [ref, getId, items, delayedUpdateSizes, preMeasured, setTargets, dimensions]
    );

    mutationListener(() => {
        if (observeSubtree) {
            triggerDelayedUpdateSizes();
        }
    });

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

        triggerDelayedUpdateSizes();
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

    useLayoutEffect(() => {
        if (!shouldMeasure) {
            return;
        }

        const { changed, res } = calculateDimensions(
            ref,
            items,
            preMeasured,
            getId,
            true,
            cache.current,
            dimensions.current,
            setTargets
        );

        if (changed) {
            updateDimensions(res);
        }
    }, [ref, getId, shouldMeasure, items, getItemDimensions, preMeasured, setTargets, dimensions, updateDimensions]);

    if (!shouldMeasure) {
        unMeasuredDimensions.current = calculatedSize;
        return unMeasuredDimensions;
    }

    return dimensions;
};
