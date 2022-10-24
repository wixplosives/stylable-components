import { MutableRefObject, RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
import type { DimensionsById } from '../../common';
import type { ListProps } from '../../list/list';
import type { ScrollListProps } from '../../scroll-list/scroll-list';
import { getRenderedIndexes } from '../helpers';

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

            const { firstIndex, lastIndex } = getRenderedIndexes({
                list: scrollListRef.current,
                items,
                getId,
            });

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
                scrollTarget.scrollBy({ top: calculateDistance({ itemIndex: firstIndex, direction: 'up' }) });
            } else if (lastIndex < selectedIndex) {
                scrollTarget.scrollBy({ top: calculateDistance({ itemIndex: lastIndex, direction: 'down' }) });
            }

            timeout.current = window.setTimeout(() => scrollIntoView(selectedIndex));
        },
        [scrollWindow, scrollListRef, getId, items, calculateDistance]
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
