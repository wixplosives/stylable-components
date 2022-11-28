import { MutableRefObject, RefObject, useMemo, useRef } from 'react';
import type { DimensionsById } from '../../common';
import { defaultPosition } from '../../common';
import { usePositionInParent } from '../../hooks/use-position';
import type { ListProps } from '../../list/list';
import type { ScrollListItemInfo, ScrollListProps } from '../../scroll-list/scroll-list';

export interface ScrollListPositioningProps {
    /**
     * if set to false, items will not be unmounted when out of view
     * @default true
     */
    unmountItems?: boolean;
    /**
     * Gap between items
     *
     * @default 0
     */
    itemGap?: number;
    /**
     * Items in a row or column
     * @default 1
     */
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
    getItemInfo,
    itemSize,
    isHorizontal,
    unmountItems = true,
    itemGap = 0,
    itemsInRow = 1,
    extraRenderSize = 0.5,
    averageItemSize,
    scrollWindowSize,
    itemsDimensions,
    scrollOffset = 0,
    maxScrollSize,
    scrollPosition,
    scrollListRef,
}: ScrollListPositioningProps & {
    items: ListProps<T>['items'];
    getId: ListProps<T>['getId'];
    getItemInfo: (item: T) => ScrollListItemInfo<T>;
    itemSize: ScrollListProps<T, EL>['itemSize'];
    isHorizontal: boolean;
    itemGap: ScrollListProps<T, EL>['itemGap'];
    itemsInRow: ScrollListProps<T, EL>['itemsInRow'];
    extraRenderSize: ScrollListProps<T, EL>['extraRenderSize'];
    averageItemSize: number;
    scrollWindowSize: number;
    itemsDimensions: MutableRefObject<DimensionsById>;
    maxScrollSize: number;
    scrollPosition: number;
    scrollListRef: RefObject<EL>;
}) => {
    const lastRenderedItem = useRef(0);
    const shouldMeasureOffset = typeof scrollOffset === 'number' ? defaultPosition : scrollOffset;
    const offsetFromParent = usePositionInParent(scrollListRef, shouldMeasureOffset);
    const usedOffset =
        (typeof scrollOffset === 'number' ? scrollOffset : isHorizontal ? offsetFromParent.x : offsetFromParent.y) || 0;

    //                Scroll List
    //            ┌─────────────────┐
    //            │                 │
    //            │                 │firstWantedPixel
    //            ├─────────────────┼────────────────────┐
    //            │                 │                    │
    //            │                 │                    │
    //            │                 │ ScrollWindow       │
    //       ┌────┴─────────────────┴─────────────┐      │
    //       │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│      │
    //       │    │                 │    ▲        │      │  shownItems
    //       │    │                 │    │        │      │◄─────────────────────
    //   ────┴───►│                 │    │ Offset │      │  to be passed to List
    //   Scrolled │                 │             │      │
    //       │    │                 │             │      │
    //       └────┼─────────────────┼─────────────┘      │
    //            │                 │                    │
    //            │                 │                    │
    //            │                 │ lastWantedPixel    │
    //   ┌► ──────┼─────────────────┼────────────────────┘
    //   │        │                 │ if accounted for
    //   │        │                 │
    //   │        │                 │ scroll position
    //   │        │                 │
    //   │        │                 │ and offset
    //   │        │                 │
    //   │        └─────────────────┘
    //   └─ Extra render size (0.5 for this example)

    // Last wanted pixel is either the position of scroll window with extra taking offset and scroll into account;
    // or the potential last pixel of the scroll list
    const lastWantedPixel = useMemo(() => {
        const scrollWindowSizeWithExtra = (1 + extraRenderSize) * scrollWindowSize;

        return Math.min(scrollWindowSizeWithExtra - usedOffset + scrollPosition, maxScrollSize);
    }, [extraRenderSize, scrollWindowSize, usedOffset, scrollPosition, maxScrollSize]);

    // First wanted pixel is counted backwards from last wanted pixel;
    // it can't be more than scrollWindow 2 times (as extra is between 0 and 1);
    const firstWantedPixel = useMemo(
        () => (unmountItems ? lastWantedPixel - 2 * scrollWindowSize : 0),
        [unmountItems, scrollWindowSize, lastWantedPixel]
    );

    return useMemo(() => {
        if (typeof itemSize === 'number') {
            const firstShownItemIndex = unmountItems ? Math.ceil(firstWantedPixel / itemSize) : 0;
            let lastShownItemIndex = Math.ceil(lastWantedPixel / itemSize);

            if (!unmountItems) {
                lastShownItemIndex = lastRenderedItem.current = Math.max(lastShownItemIndex, lastRenderedItem.current);
            }

            return {
                firstWantedPixel,
                firstShownItemIndex: firstShownItemIndex > 0 ? firstShownItemIndex : 0,
                lastShownItemIndex,
            };
        }

        let amountOfTakenPixels = -itemGap; // Initializing with -itemGap to compensate for adding gap for every item
        let firstTakenPixel: null | number = null;
        let firstShownItemIndex = 0;

        for (let rowIndex = 0; rowIndex < items.length; rowIndex += itemsInRow) {
            let maxRowSize = 0;

            for (
                let columnIndex = 0;
                columnIndex < itemsInRow && rowIndex + columnIndex < items.length;
                columnIndex++
            ) {
                const item = items[rowIndex + columnIndex]!;
                const id = getId(item);
                const size =
                    (itemSize === false
                        ? isHorizontal
                            ? itemsDimensions.current[id]?.width
                            : itemsDimensions.current[id]?.height
                        : itemSize?.(getItemInfo(item))) ?? averageItemSize;

                maxRowSize = Math.max(size, maxRowSize);
            }

            amountOfTakenPixels += maxRowSize + itemGap;

            if (unmountItems && amountOfTakenPixels > firstWantedPixel && firstTakenPixel === null) {
                firstTakenPixel = amountOfTakenPixels - maxRowSize;
                firstShownItemIndex = rowIndex;
            }

            if (amountOfTakenPixels > lastWantedPixel) {
                let lastShownItemIndex = rowIndex;

                if (!unmountItems) {
                    lastShownItemIndex = lastRenderedItem.current = Math.max(
                        lastShownItemIndex,
                        lastRenderedItem.current
                    );
                }

                return {
                    firstWantedPixel: firstTakenPixel ?? 0,
                    firstShownItemIndex: firstShownItemIndex,
                    lastShownItemIndex,
                };
            }
        }

        const estimatedLastShownItemIndex = maxScrollSize / averageItemSize;

        return {
            firstWantedPixel: firstTakenPixel ?? 0,
            firstShownItemIndex: firstShownItemIndex,
            lastShownItemIndex: !isNaN(estimatedLastShownItemIndex)
                ? Math.max(items.length, estimatedLastShownItemIndex)
                : items.length,
        };
    }, [
        averageItemSize,
        firstWantedPixel,
        getId,
        getItemInfo,
        isHorizontal,
        itemGap,
        itemSize,
        items,
        itemsDimensions,
        itemsInRow,
        lastWantedPixel,
        maxScrollSize,
        unmountItems,
    ]);
};
