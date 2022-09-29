import { RefObject, useCallback, useEffect, useMemo, useRef } from 'react';
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
    itemsDimensions: DimensionsById;
    extraRenderSize: number;
    isHorizontal: boolean;
    scrollWindowSize: number;
}) => {
    const timer = useRef(0);
    const selectedIndex = useMemo(() => items.findIndex((i) => getId(i) === selected), [items, getId, selected]);
    const getRenderedIndexes = useCallback(() => {
        const list = scrollListRef?.current;
        const first = list?.querySelector(`[data-id]:first-child`);
        const last = list?.querySelector(`[data-id]:last-child`);
        const firstId = first?.attributes.getNamedItem('data-id')?.value;
        const lastId = last?.attributes.getNamedItem('data-id')?.value;
        const firstIndex = items.findIndex((i) => getId(i) === firstId);
        const lastIndex = items.findIndex((i) => getId(i) === lastId);

        return { firstIndex, lastIndex };
    }, [scrollListRef, getId, items]);

    const scrollTo = useCallback(
        (selectedIndex: number) => {
            const { firstIndex, lastIndex } = getRenderedIndexes();

            if (firstIndex === -1 || lastIndex === -1) {
                timer.current = window.setTimeout(() => scrollTo(selectedIndex));
                return;
            }

            const scrollTarget = scrollWindow?.current ?? window;
            const calculateDistance = (anchor: { from: number } | { to: number }) => {
                const direction = 'from' in anchor ? 1 : -1;
                const anchorIndex = 'from' in anchor ? anchor.from : anchor.to;
                let distance = 0;

                for (let index = anchorIndex; index !== selectedIndex; 'from' in anchor ? index++ : index--) {
                    const item = items[index]!;
                    const id = getId(item);
                    const { height, width } = itemsDimensions[id]!;
                    const size = (isHorizontal ? width : height) ?? averageItemSize;
                    // console.debug({ index, size });
                    distance += size;
                }

                distance += scrollWindowSize * extraRenderSize;

                if ('from' in anchor) {
                    distance += scrollWindowSize;
                }

                return direction * distance;
            };
            const scrollIntoView = (selected: number) => {
                const node = scrollListRef.current?.querySelector(`[data-id='${getId(items[selected]!)}']`);
                if (node === null) {
                    // console.debug(
                    //     'called to be scrolled into view, but it is not rendered yet; triggering scrollTo once more'
                    // );
                    scrollTo(selected);
                } else {
                    // console.debug('we have rendered element, just need to scroll it into view');
                    node?.scrollIntoView({
                        block: 'center',
                        inline: 'center',
                    });
                }
            };

            if (selectedIndex < firstIndex) {
                const by = calculateDistance({ to: firstIndex });
                // console.debug(`should scroll up from ${firstIndex} by ${by}`);
                scrollTarget.scrollBy(0, by);

                timer.current = window.setTimeout(() => scrollIntoView(selectedIndex));
            } else if (lastIndex < selectedIndex) {
                const by = calculateDistance({ from: lastIndex });
                // console.debug(`should scroll down from ${lastIndex} by ${by}`);
                scrollTarget.scrollBy(0, by);

                timer.current = window.setTimeout(() => scrollIntoView(selectedIndex));
            } else {
                // console.debug('index in rendered items, scroll into view');

                timer.current = window.setTimeout(() => scrollIntoView(selectedIndex));
            }
        },
        // TODO: itemDimensions should not trigger re-rendering :-(
        [
            getRenderedIndexes,
            scrollWindow,
            getId,
            items,
            scrollListRef,
            averageItemSize,
            isHorizontal,
            extraRenderSize,
            scrollWindowSize,
        ]
    );

    useEffect(() => {
        if (selectedIndex > -1) {
            // console.debug('scrollTo selected index', selectedIndex);
            scrollTo(selectedIndex);
        }

        return () => {
            clearTimeout(timer.current);
        };
    }, [scrollTo, selectedIndex]);
};
