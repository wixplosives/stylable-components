import { useEffect, useRef } from 'react';
import type { ScrollListProps } from '../scroll-list';

export const useScrollListScrollToSelected = <T, EL extends HTMLElement>({
    selected,
    scrollWindow,
    firstShownItemIndex,
    lastShownItemIndex,
    items,
    getId,
    avgItemSize,
    extraRenderSize,
    maxScrollSize,
    scrollWindowSize,
}: {
    selected: string | undefined;
    scrollWindow?: ScrollListProps<T, EL>['scrollWindow'];
    firstShownItemIndex: number;
    lastShownItemIndex: number;
    items: ScrollListProps<T, EL>['items'];
    getId: ScrollListProps<T, EL>['getId'];
    extraRenderSize: ScrollListProps<T, EL>['extraRenderSize'];
    avgItemSize: number;
    maxScrollSize: number;
    scrollWindowSize: number;
}) => {
    const selectedId = useRef(selected);

    // Naive implementation would work only for virtual scroll; not infinite one.
    useEffect(() => {
        const scrollTarget = scrollWindow?.current ?? window;
        const queryTarget = scrollWindow?.current ?? document;

        if (selected && selectedId.current !== selected) {
            selectedId.current = selected;
            const selectedIndex = items.findIndex((i) => getId(i) === selected);
            const selectedNode = queryTarget.querySelector(`[data-id="${selected}"]`);

            if (selectedIndex < firstShownItemIndex) {
                // should scroll up
                scrollTarget.scrollBy(0, 2 * (selectedIndex - lastShownItemIndex) * avgItemSize);

                window.setTimeout(() => {
                    selectedNode?.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                    });
                }, 100);
            } else if (lastShownItemIndex < selectedIndex) {
                // should scroll down
                scrollTarget.scrollBy(0, -2 * (firstShownItemIndex - selectedIndex) * avgItemSize);

                window.setTimeout(() => {
                    selectedNode?.scrollIntoView({
                        block: 'nearest',
                        inline: 'nearest',
                    });
                }, 100);
            } else {
                // should be visible
                selectedNode?.scrollIntoView({
                    block: 'nearest',
                    inline: 'nearest',
                });
            }
        }
    }, [
        scrollWindow,
        scrollWindowSize,
        maxScrollSize,
        getId,
        items,
        firstShownItemIndex,
        lastShownItemIndex,
        selected,
        avgItemSize,
        extraRenderSize,
    ]);
};
