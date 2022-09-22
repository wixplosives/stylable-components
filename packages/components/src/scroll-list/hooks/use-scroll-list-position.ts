import { RefObject, useMemo, useRef } from 'react';
import type { SizesById } from '../../hooks/use-element-rect';
import { defaultPos, usePositionInParent } from '../../hooks/use-position';
import type { ScrollListProps } from '../scroll-list';

export interface ScrollListPositioningProps {
    /**
     * if set to false, items will not be unmounted when out of view
     * @default true
     */
    unmountItems?: boolean;
    itemGap?: number;
    itemsInRow?: number;
    /**
     * Scroll offset if the scroll lists has a scroll window that is external to itself, it can have elements before it.
     *
     * For vertical lists, this affects scrollTop. For horizontal lists, this affects scrollLeft.
     *   false: no remeasure,
     *   true: measure on changes,
     *   number: use the number as size
     *
     *   @default = 0
     */
    scrollOffset?: number | boolean;
}

export const useScrollListPosition = <T, EL extends HTMLElement>({
    items,
    getId,
    itemCount,
    itemSize,
    isHorizontal,
    unmountItems = true,
    itemGap = 0,
    itemsInRow = 1,
    extraRenderSize = 0.5,
    avgItemSize,
    scrollWindowSize,
    sizes,
    scrollOffset = 0,
    scrollPosition,
    actualRef,
}: ScrollListPositioningProps & {
    items: ScrollListProps<T, EL>['items'];
    getId: ScrollListProps<T, EL>['getId'];
    focused?: string; // TODO: not only string ;-( useStateControls really
    selected?: string; // TODO: not only string ;-( useStateControls really
    itemCount: ScrollListProps<T, EL>['itemCount'];
    itemSize: ScrollListProps<T, EL>['itemSize'];
    isHorizontal: boolean;
    itemGap: ScrollListProps<T, EL>['itemGap'];
    itemsInRow: ScrollListProps<T, EL>['itemsInRow'];
    extraRenderSize: ScrollListProps<T, EL>['extraRenderSize'];
    avgItemSize: number;
    scrollWindowSize: number;
    sizes: SizesById;
    scrollPosition: number;
    actualRef: RefObject<EL>;
}) => {
    const lastRenderedItem = useRef({
        items,
        last: 0,
    });

    if (lastRenderedItem.current.items !== items) {
        // clear last rendered item
        lastRenderedItem.current.items = items;
        lastRenderedItem.current.last = 0;
    }

    const shouldMeasureOffset = typeof scrollOffset === 'number' ? defaultPos : scrollOffset;
    const offsetFromParent = usePositionInParent(actualRef, shouldMeasureOffset);
    const usedOffset =
        (typeof scrollOffset === 'number' ? scrollOffset : isHorizontal ? offsetFromParent.x : offsetFromParent.y) || 0;
    const itemsNumber = useMemo(
        () => (itemCount === undefined ? items.length : itemCount === -1 ? items.length + 5000 : itemCount),
        [itemCount, items.length]
    );

    const maxScrollSize = useMemo(
        () => avgItemSize * Math.ceil(itemsNumber / itemsInRow) + itemGap * Math.ceil((itemsNumber - 1) / itemsInRow),
        [avgItemSize, itemsNumber, itemGap, itemsInRow]
    );

    const lastWantedPixel = useMemo(
        () => Math.min(scrollWindowSize * (1 + extraRenderSize) + scrollPosition - usedOffset, maxScrollSize),
        [extraRenderSize, scrollWindowSize, usedOffset, scrollPosition, maxScrollSize]
    );

    const firstWantedPixel = useMemo(
        () => (unmountItems ? lastWantedPixel - scrollWindowSize * (2 + extraRenderSize) : 0),
        [unmountItems, extraRenderSize, scrollWindowSize, lastWantedPixel]
    );

    if (typeof itemSize === 'number') {
        let lastShownItemIndex = Math.ceil(lastWantedPixel / itemSize);
        if (!unmountItems) {
            lastShownItemIndex = lastRenderedItem.current.last = Math.max(
                lastShownItemIndex,
                lastRenderedItem.current.last
            );
        }
        return {
            firstWantedPixel,
            lastWantedPixel,
            firstShownItemIndex: unmountItems ? Math.ceil(firstWantedPixel / itemSize) : 0,
            lastShownItemIndex,
            maxScrollSize,
        };
    }

    let taken = -itemGap;
    let firstTakenPixel: null | number = null;
    let firstShownItemIndex = 0;

    for (let i = 0; i < items.length; i += itemsInRow) {
        let itemMaxSize = 0;

        for (let z = 0; z < itemsInRow && z + i < items.length; z++) {
            const id = getId(items[i + z]!);
            const itemSize = (isHorizontal ? sizes[id]?.width : sizes[id]?.height) ?? avgItemSize;
            itemMaxSize = Math.max(itemMaxSize, itemSize);
        }
        taken += itemMaxSize + itemGap;
        if (unmountItems && taken > firstWantedPixel && firstTakenPixel === null) {
            firstTakenPixel = taken - itemMaxSize;
            firstShownItemIndex = i;
        }
        if (taken > lastWantedPixel) {
            let lastShownItemIndex = i;
            if (!unmountItems) {
                lastRenderedItem.current.items = items;
                lastShownItemIndex = lastRenderedItem.current.last = Math.max(
                    lastShownItemIndex,
                    lastRenderedItem.current.last
                );
            }

            return {
                firstWantedPixel: firstTakenPixel || 0,
                lastWantedPixel: taken - itemMaxSize,
                firstShownItemIndex: firstShownItemIndex,
                lastShownItemIndex,
                maxScrollSize,
            };
        }
    }

    return {
        firstWantedPixel: firstTakenPixel || 0,
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: Math.max(items.length, maxScrollSize / avgItemSize),
        maxScrollSize,
    };
};
