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
    // Debug tools
    const isDebugOn = true;
    const step = useRef(0);

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

    const scrollTo = useCallback(
        (selectedIndex: number) => {
            step.current += 1;
            isDebugOn && console.debug(`#${step.current} scrollTo called`);

            const { firstIndex, lastIndex } = getRenderedIndexes();

            if (firstIndex === null || lastIndex === null) {
                return;
            }

            if (firstIndex === -1 || lastIndex === -1) {
                isDebugOn && console.debug("… … … list haven't rendered yet, waiting … … …");
                window.setTimeout(() => scrollTo(selectedIndex));
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
                    const { height, width } = itemsDimensions.current[id]!;
                    const size = (isHorizontal ? width : height) ?? averageItemSize;

                    distance += size;
                }

                distance += scrollWindowSize * extraRenderSize;

                if ('from' in anchor) {
                    distance += scrollWindowSize;
                }

                return Math.floor(direction * distance);
            };

            const scrollIntoView = (selected: number) => {
                const node = scrollListRef.current?.querySelector(`[data-id='${getId(items[selected]!)}']`);
                if (node === null) {
                    isDebugOn &&
                        console.debug(
                            'called to be scrolled into view, but it is not rendered yet; triggering scrollTo once more'
                        );
                    window.setTimeout(() => scrollTo(selected));
                } else {
                    isDebugOn && console.debug('we have rendered element, just need to scroll it into view');
                    node?.scrollIntoView({
                        block: 'center',
                        inline: 'center',
                        // Not always scrolls from the "correct" side perspective-wise;
                        // thus smoothness just adds to "uncanny valley" effect.
                        // behavior: 'smooth',
                    });
                    isScrollingToSelection.current = false;
                    isDebugOn && console.groupEnd();
                }
            };

            if (selectedIndex < firstIndex) {
                const by = calculateDistance({ to: firstIndex });
                scrollTarget.scrollBy({ behavior: 'auto', top: by });
                isDebugOn && console.debug(`should scroll up from ${firstIndex} by ${by}`);
            } else if (lastIndex < selectedIndex) {
                const by = calculateDistance({ from: lastIndex });
                scrollTarget.scrollBy({ behavior: 'auto', top: by });
                isDebugOn && console.debug(`should scroll down from ${lastIndex} by ${by}`);
            } else {
                isDebugOn && console.debug('index in rendered items, scroll into view');
            }

            window.setTimeout(() => scrollIntoView(selectedIndex));
        },
        [
            isDebugOn,
            getRenderedIndexes,
            scrollWindow,
            scrollWindowSize,
            extraRenderSize,
            items,
            getId,
            itemsDimensions,
            isHorizontal,
            averageItemSize,
            scrollListRef,
        ]
    );

    useEffect(() => {
        if (selectedIndex > -1 && !isScrollingToSelection.current) {
            console.clear();
            step.current = 0;
            isScrollingToSelection.current = true;

            console.group(`Selected index: ${selectedIndex}`);
            scrollTo(selectedIndex);
        }
    }, [scrollTo, selectedIndex]);
};
