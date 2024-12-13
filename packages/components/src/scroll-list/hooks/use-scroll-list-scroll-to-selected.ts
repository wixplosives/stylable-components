import { MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import type { DimensionsById } from '../../common/index.js';
import type { ListProps } from '../../list/list.js';
import type { ScrollListProps } from '../../scroll-list/scroll-list.js';

export const useScrollListScrollToSelected = <T, EL extends HTMLElement>({
    scrollToSelection,
    scrollWindow,
    scrollListRef,
    items,
    getId,
    selected,
    averageItemSize,
    itemsDimensions,
    mountedItems,
    isHorizontal,
    extraRenderSize,
    scrollWindowSize,
}: {
    scrollToSelection: boolean;
    scrollWindow?: ScrollListProps<T, EL>['scrollWindow'];
    scrollListRef: RefObject<EL | null>;
    items: ListProps<T>['items'];
    getId: ListProps<T>['getId'];
    selected: string | undefined;
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
    const selectedIndex = useMemo(() => items.findIndex((i) => getId(i) === selected), [items, getId, selected]);
    const calculateDistance = useCallback(
        ({ itemIndex, direction }: { itemIndex: number; direction: 'up' | 'down' }) => {
            let distance = 0;

            for (let index = itemIndex; index !== selectedIndex; direction === 'down' ? index++ : index--) {
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
        [
            averageItemSize,
            extraRenderSize,
            getId,
            isHorizontal,
            items,
            itemsDimensions,
            scrollWindowSize,
            selectedIndex,
        ],
    );
    const cleanUp = () => {
        isScrollingToSelection.current = false;
        loadingTimeout.current = 0;
        clearTimeout(timeout.current);
    };
    const scrollTo = useCallback(
        (selectedIndex: number, repeated = false) => {
            if (!scrollListRef.current) {
                return;
            }

            clearTimeout(timeout.current);

            const scrollIntoView = (selected: number, position: ScrollLogicalPosition) => {
                const node = scrollListRef.current?.querySelector(`[data-id='${getId(items[selected]!)}']`);
                if (!node) {
                    timeout.current = window.setTimeout(
                        () => isScrollingToSelection.current && scrollTo(selected, true),
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

            if (selectedIndex < firstIndex) {
                position = 'start';
                scrollTarget.scrollBy({ top: calculateDistance({ itemIndex: firstIndex, direction: 'up' }) });
            } else if (lastIndex < selectedIndex) {
                position = 'end';
                scrollTarget.scrollBy({ top: calculateDistance({ itemIndex: lastIndex, direction: 'down' }) });
            }

            timeout.current = window.setTimeout(() => scrollIntoView(selectedIndex, repeated ? 'center' : position));
        },
        [scrollListRef, scrollWindow, mountedItems, items, getId, calculateDistance],
    );

    useEffect(() => {
        if (
            scrollToSelection &&
            selectedIndex > -1 &&
            mountedItems.current.size > 0 &&
            !isScrollingToSelection.current
        ) {
            isScrollingToSelection.current = true;

            scrollTo(selectedIndex);
        }

        return () => {
            cleanUp();
        };
    }, [scrollToSelection, mountedItems, scrollTo, selectedIndex]);
};
