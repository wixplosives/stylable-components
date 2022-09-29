import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { childrenById } from '../common/element-id-utils';
import { unchanged, useDelayedUpdateState } from './use-delayed-update';
import {
    createSetableMutationObserver,
    DimensionsById,
    ElementDimensions,
    rectToDimensions,
    unMeasured,
    useSetableObserver,
} from './use-element-rect';

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
    const itemSize = (item: T) => {
        if (size !== undefined) {
            return typeof size === 'function' ? size(item) : size;
        }
        return unMeasured;
    };

    if (size !== undefined || !measure || !ref.current) {
        let changed = false;
        const res = items.reduce((acc, item) => {
            const id = getId(item);
            const itemRes = itemSize(item);
            acc[id] = itemRes;
            if (oldRes[id]?.height !== itemRes?.height || oldRes[id]?.width !== itemRes?.width) {
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
            acc[id] = unMeasured;
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

export const useScrollListItemsDimensions = <T, EL extends HTMLElement>(
    ref: React.RefObject<EL>,
    items: T[],
    getId: (item: T) => string,
    getItemSize: false | ElementDimensions | ((item: T) => ElementDimensions),
    observeSubtree = false
): DimensionsById => {
    const shouldMeasure = getItemSize === false;
    const preMeasured = typeof getItemSize === 'boolean' ? undefined : getItemSize;
    const cache = useRef(new Map<string, ElementDimensions>());
    const calculatedSize = useMemo(
        () => calculateDimensions(ref, items, preMeasured, getId, false, cache.current, {}).res,
        [ref, getId, items, preMeasured]
    );

    // TODO: question, won't it re-render component on sizes changes? although its an object, it is shallow?
    const [dimensions, updateDimensions] = useState(() => calculatedSize);
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
                    dimensions,
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
            dimensions,
            setTargets
        );

        if (changed) {
            updateDimensions(res);
        }
    }, [ref, getId, shouldMeasure, items, getItemSize, preMeasured, setTargets, dimensions]);

    if (!shouldMeasure) {
        return calculatedSize;
    }

    return dimensions;
};
