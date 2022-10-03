import { MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import type { DimensionsById } from '../hooks/use-element-rect';
import type { ListProps } from '../list/list';
import type { ScrollListProps } from '../scroll-list/scroll-list';

export const useScrollListScrollToSelected = <T, EL extends HTMLElement>({
    scrollWindow,
    scrollListRef,
    items,
    getId,
    selected,
    averageItemSize,
    itemsDimensions,
    isHorizontal,
    extraRenderSize,
    scrollWindowSize,
}: {
    scrollWindow?: ScrollListProps<T, EL>['scrollWindow'];
    scrollListRef: RefObject<EL>;
    items: ListProps<T>['items'];
    getId: ListProps<T>['getId'];
    selected: string | undefined;
    averageItemSize: number;
    itemsDimensions: MutableRefObject<DimensionsById>;
    extraRenderSize: number;
    isHorizontal: boolean;
    scrollWindowSize: number;
}) => {
    const loadingTimeout = useRef(0);
    const timeout = useRef(0);
    const isScrollingToSelection = useRef(false);
    const selectedIndex = useMemo(() => items.findIndex((i) => getId(i) === selected), [items, getId, selected]);
    const getRenderedIndexes = useCallback(() => {
        const list = scrollListRef?.current;
        if (!list) {
            return { firstIndex: null, lastIndex: null };
        }
        const first = list?.querySelector(`[data-id]:first-child`);
        const last = list?.querySelector(`[data-id]:last-child`);
        const firstId = first?.attributes.getNamedItem('data-id')?.value;
        const lastId = last?.attributes.getNamedItem('data-id')?.value;
        const firstIndex = items.findIndex((i) => getId(i) === firstId);
        const lastIndex = items.findIndex((i) => getId(i) === lastId);

        return { firstIndex, lastIndex };
    }, [scrollListRef, getId, items]);
    const calculateDistance = useCallback(
        (anchor: { from: number } | { to: number }) => {
            const direction = 'from' in anchor ? 1 : -1;
            const anchorIndex = 'from' in anchor ? anchor.from : anchor.to;
            let distance = 0;

            for (let index = anchorIndex; index !== selectedIndex; 'from' in anchor ? index++ : index--) {
                const item = items[index]!;
                const id = getId(item);
                const { height, width } = itemsDimensions.current[id]!;
                const size = (isHorizontal ? width : height) ?? averageItemSize;

                distance += size;
            }

            distance += scrollWindowSize * extraRenderSize;

            if ('from' in anchor) {
                distance += scrollWindowSize;
            }

            return Math.floor(direction * distance);
        },
        [averageItemSize, extraRenderSize, getId, isHorizontal, items, itemsDimensions, scrollWindowSize, selectedIndex]
    );
    const cleanUp = () => {
        isScrollingToSelection.current = false;
        loadingTimeout.current = 0;
        clearTimeout(timeout.current);
    };
    const scrollTo = useCallback(
        (selectedIndex: number) => {
            clearTimeout(timeout.current);

            const { firstIndex, lastIndex } = getRenderedIndexes();

            if (firstIndex === null || lastIndex === null) {
                return;
            }

            if (firstIndex === -1 || lastIndex === -1) {
                loadingTimeout.current++;
                // Try 10 times
                if (loadingTimeout.current < 10) {
                    timeout.current = window.setTimeout(
                        () => isScrollingToSelection.current && scrollTo(selectedIndex),
                        100 // with 100ms delay
                    );
                }
                return;
            }

            const scrollTarget = scrollWindow?.current ?? window;

            const scrollIntoView = (selected: number) => {
                const node = scrollListRef.current?.querySelector(`[data-id='${getId(items[selected]!)}']`);
                if (node === null) {
                    timeout.current = window.setTimeout(() => isScrollingToSelection.current && scrollTo(selected));
                } else {
                    node?.scrollIntoView({
                        block: 'center',
                        inline: 'center',
                        /**
                         * Not always scrolls from the "correct" side perspective-wise;
                         * thus smoothness just adds to "uncanny valley" effect.
                         */
                        // behavior: 'smooth',
                    });
                    cleanUp();
                }
            };

            if (selectedIndex < firstIndex) {
                scrollTarget.scrollBy({ top: calculateDistance({ to: firstIndex }) });
            } else if (lastIndex < selectedIndex) {
                scrollTarget.scrollBy({ top: calculateDistance({ from: lastIndex }) });
            }

            timeout.current = window.setTimeout(() => scrollIntoView(selectedIndex));
        },
        [getRenderedIndexes, scrollWindow, scrollListRef, getId, items, calculateDistance]
    );

    useEffect(() => {
        if (selectedIndex > -1 && !isScrollingToSelection.current) {
            isScrollingToSelection.current = true;

            scrollTo(selectedIndex);
        }

        return () => {
            cleanUp();
        };
    }, [scrollTo, selectedIndex]);
};
