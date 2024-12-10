import { MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import type { DimensionsById } from '../../common';
import type { ListProps } from '../../list/list';
import type { ScrollListProps } from '../../scroll-list/scroll-list';

export const useScrollListScrollToFocused = <T, EL extends HTMLElement>({
    scrollToFocused,
    scrollWindow,
    scrollListRef,
    items,
    getId,
    focused,
    averageItemSize,
    itemsDimensions,
    mountedItems,
    isHorizontal,
    extraRenderSize,
    scrollWindowSize,
}: {
    scrollToFocused: ScrollListProps<T, EL>['scrollToFocused'];
    scrollWindow?: ScrollListProps<T, EL>['scrollWindow'];
    scrollListRef: RefObject<EL | null>;
    items: ListProps<T>['items'];
    getId: ListProps<T>['getId'];
    focused?: string;
    averageItemSize: number;
    itemsDimensions: MutableRefObject<DimensionsById>;
    mountedItems: MutableRefObject<Set<string>>;
    extraRenderSize: number;
    isHorizontal: boolean;
    scrollWindowSize: number;
}) => {
    const loadingTimeout = useRef(0);
    const timeout = useRef(0);
    const isScrollingToSelection = useRef(false);
    const focusedIndex = useMemo(() => items.findIndex((i) => getId(i) === focused), [items, getId, focused]);
    const calculateDistance = useCallback(
        ({ itemIndex, direction }: { itemIndex: number; direction: 'up' | 'down' }) => {
            let distance = 0;

            for (let index = itemIndex; index !== focusedIndex; direction === 'down' ? index++ : index--) {
                const item = items[index]!;
                const id = getId(item);
                const { height, width } = itemsDimensions.current[id] || {
                    height: averageItemSize,
                    width: averageItemSize,
                };
                const size = (isHorizontal ? width : height) ?? averageItemSize;

                distance += size;
            }

            distance += scrollWindowSize * extraRenderSize;

            if (direction === 'down') {
                distance += scrollWindowSize;
            }

            return Math.floor((direction === 'down' ? 1 : -1) * distance);
        },
        [averageItemSize, extraRenderSize, getId, isHorizontal, items, itemsDimensions, scrollWindowSize, focusedIndex],
    );
    const cleanUp = () => {
        isScrollingToSelection.current = false;
        loadingTimeout.current = 0;
        clearTimeout(timeout.current);
    };
    const scrollTo = useCallback(
        (focusedIndex: number, repeated = false) => {
            if (!scrollListRef.current) {
                return;
            }

            clearTimeout(timeout.current);

            const scrollIntoView = (focusedIndex: number, position: ScrollLogicalPosition) => {
                const node = scrollListRef.current?.querySelector(`[data-id='${getId(items[focusedIndex]!)}']`);
                if (!node) {
                    timeout.current = window.setTimeout(
                        () => isScrollingToSelection.current && scrollTo(focusedIndex, true),
                    );
                } else {
                    scrollIntoViewIfNeeded(node, {
                        scrollMode: 'if-needed',
                        block: position,
                        inline: position,
                        boundary: scrollWindow?.current,
                    });
                    cleanUp();
                }
            };

            const scrollTarget = scrollWindow?.current ?? window;
            const mountedIndexes = [...mountedItems.current].map((id) => items.findIndex((i) => getId(i) === id));
            const firstIndex = Math.min(...mountedIndexes);
            const lastIndex = Math.max(...mountedIndexes);

            let position: ScrollLogicalPosition = 'nearest';

            if (focusedIndex < firstIndex) {
                position = 'start';
                scrollTarget.scrollBy({ top: calculateDistance({ itemIndex: firstIndex, direction: 'up' }) });
            } else if (lastIndex < focusedIndex) {
                position = 'end';
                scrollTarget.scrollBy({ top: calculateDistance({ itemIndex: lastIndex, direction: 'down' }) });
            }

            timeout.current = window.setTimeout(() => scrollIntoView(focusedIndex, repeated ? 'center' : position));
        },
        [scrollListRef, scrollWindow, mountedItems, items, getId, calculateDistance],
    );

    useEffect(() => {
        if (scrollToFocused && focusedIndex > -1 && mountedItems.current.size > 0 && !isScrollingToSelection.current) {
            isScrollingToSelection.current = true;

            scrollTo(focusedIndex);
        }

        return () => {
            cleanUp();
        };
    }, [scrollToFocused, mountedItems, scrollTo, focusedIndex]);
};
