import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import type { ElementSlot, PropMapping } from '../common/types';
import { useElementDimension, useIdBasedRects, WatchedSize } from '../hooks/use-element-rect';
import { concatClasses, defaultRoot, defineElementSlot, mergeObjectInternalWins } from '../hooks/use-element-slot';
import { defaultPos, usePositionInParent } from '../hooks/use-position';
import { useScroll } from '../hooks/use-scroll';
import { useStateControls } from '../hooks/use-state-controls';
import { List, ListProps, listRootParent } from '../list/list';
import { Preloader } from '../preloader/preloader';
import { classes as preloaderCSS } from '../preloader/variants/circle-preloader.st.css';
import { classes } from './scroll-list.st.css';

const defaultPreloader: ElementSlot<{}> = {
    el: Preloader,
    props: {
        className: preloaderCSS.root,
    },
};
export type ScrollListRootMinimalProps = Pick<
    React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>,
    'children' | 'style' | 'ref' | 'className'
>;
export const ScrollListRootPropMapping: PropMapping<ScrollListRootMinimalProps> = {
    style: mergeObjectInternalWins,
    className: concatClasses,
};
export const {
    forward: forwardScrollListRoot,
    slot: scrollListRoot,
    parentSlot: scrollListRootParent,
    Slot: RootSlot,
} = defineElementSlot<ScrollListRootMinimalProps, typeof ScrollListRootPropMapping>(
    defaultRoot,
    ScrollListRootPropMapping
);

export interface ItemInfo<T> {
    data: T;
    isSelected: boolean;
    isFocused: boolean;
}

export interface OverlayProps<T> {
    shownItems: T[];
    itemSizes: Record<string, number>;
    avgSize: number;
    style?: React.CSSProperties;
}

export const { forward: forwardListRoot, slot: listRoot } = listRootParent(defaultRoot, ScrollListRootPropMapping);
export const {
    forward: forwardPreloader,
    slot: scrollListPreloader,
    parentSlot: scrollListPreloaderParent,
    Slot: PreloaderSlot,
} = defineElementSlot(defaultPreloader, {});

export const {
    forward: forwardListOverlay,
    slot: scrollListOverlay,
    parentSlot: scrollListOverlayParent,
    Slot: ListOverlaySlot,
} = defineElementSlot<OverlayProps<any>, {}>(defaultPreloader, {});

export interface ScrollListProps<T, EL extends HTMLElement> extends ListProps<T> {
    /**
     * element to watch for scroll and size updates, if omitted will use the window
     */
    scrollWindow?: React.RefObject<EL>;
    /*
     *   false: no remeasure,
     *   true: measure on changes,
     *   number: use the number as size
     */
    watchScrollWindoSize?: number | boolean;

    /**
     * Scroll offset if the scroll lists has a scroll window that is external to itself, it can have elements before it.
     *
     *
     * For vertical lists, this affects scrollTop. For horizontal lists, this affects scrollLeft.
     *  false: no remeasure,
     *  true: measure on changes,
     *  number: use the number as size
     */
    scrollOffset?: number | boolean;

    /**
     * Total number of items in the list. Note that only a few items will be rendered and displayed at a time.
     * -1 implies the list is infinite.
     * undefined implies it is the same length as the data
     */
    itemCount?: number;
    /**
     * size of the item ( height if vertical ) in pixels or a method to compute according to data
     * if omitted, item size will be measured
     */
    itemSize?: number | ((info: ItemInfo<T>) => number) | boolean;
    /**
     * size of the item ( height if vertical ) in pixels
     * @default 50
     * used if item size is not fixed
     */
    estimatedItemSize?: number;
    /**
     * size to render after scroll window size
     * 0.5 means prendering the half the scroll window size
     * @default 0.5
     */
    extraRenderedItems?: number;
    /**
     * if set to false. items will not be unmounted when out of scroll
     * @default true
     */
    unmountItems?: boolean;

    preloader?: ElementSlot<{}>;

    overlay?: ElementSlot<OverlayProps<T>>;

    /**
     * if loading the scroll list will show the preloader
     * if idle the scroll list will request more items using loadMore.
     * loading state must then be changed to 'loading' to avoid additional requests
     *
     * 'done' signifies that there are no more items to load
     *
     * @default done
     *
     */
    loadingState?: ScrollListLoadingState;
    /**
     * if provided the list will request more items when reaching the scroll length
     * you must manage the loading state as well for loadMore to work
     */
    loadMore?: (count: number) => unknown;
    /**
     * @default false
     */
    isHorizontal?: boolean;
    /**
     * allows replacing the root element of the scroll list
     */
    scrollListRoot?: typeof scrollListRoot;

    /**
     * sets a custom scroll position instead of watching container's scroll event
     */
    scrollPosition?: number;
    itemsInRow?: number;
    itemGap?: number;
    listRoot?: typeof listRoot;
}

export type ScrollListLoadingState = 'loading' | 'idle' | 'done';
export type ScrollList<T, EL extends HTMLElement = HTMLDivElement> = (props: ScrollListProps<T, EL>) => JSX.Element;
export function ScrollList<T, EL extends HTMLElement = HTMLDivElement>({
    items,
    isHorizontal = false,
    scrollWindow,
    watchScrollWindoSize,
    itemCount,
    getId,
    ItemRenderer,
    estimatedItemSize = 50,
    focusControl,
    loadMore,
    scrollOffset = 0,
    itemSize = false,
    scrollListRoot,
    listRoot,
    selectionControl,
    extraRenderedItems = 0.5,
    unmountItems = true,
    preloader,
    loadingState,
    itemGap = 0,
    itemsInRow = 1,
    transmitKeyPress,
    overlay,
    scrollPosition,
}: ScrollListProps<T, EL>): JSX.Element {
    const shouldMeasureOffset = typeof scrollOffset === 'number' ? defaultPos : scrollOffset;
    const defaultRef = useRef<EL>();
    const actualRef = (scrollListRoot?.props?.ref as React.RefObject<HTMLElement>) || defaultRef;
    const offsetFromParent = usePositionInParent(actualRef, shouldMeasureOffset);
    const usedoffset =
        (typeof scrollOffset === 'number' ? scrollOffset : isHorizontal ? offsetFromParent.x : offsetFromParent.y) || 0;
    const defaultListRef = useRef<HTMLElement>(null);
    const listRef = (listRoot?.props?.ref as React.RefObject<HTMLDivElement>) || defaultListRef;
    const scrollWindowSize = useElementDimension(scrollWindow, !isHorizontal, watchScrollWindoSize);
    const currentScroll = useScroll({ isHorizontal, ref: scrollWindow, disabled: scrollPosition !== undefined });
    const resolvedScroll = scrollPosition ?? currentScroll;
    const lastRenderedItem = useRef({
        items,
        last: 0,
    });
    if (lastRenderedItem.current.items !== items) {
        // clear last rendered item
        lastRenderedItem.current.items = items;
        lastRenderedItem.current.last = 0;
    }
    const [selected, setSelected] = useStateControls(selectionControl, undefined);
    const [focused, setFocused] = useStateControls(focusControl, undefined);

    const getItemInfo = useCallback(
        (data: T): ItemInfo<T> => ({
            data,
            isFocused: focused === getId(data),
            isSelected: selected === getId(data),
        }),
        [focused, selected, getId]
    );
    const itemCountForCalc =
        itemCount === undefined ? items.length : itemCount === -1 ? items.length + 5000 : itemCount;

    const rectOptions = useMemo(() => dimToSize(itemSize, getItemInfo), [getItemInfo, itemSize]);

    const sizes = useIdBasedRects(listRef, items, getId, rectOptions, true);
    const { totalMeasured, totalSize, itemSizes } = items.reduce(
        (acc, current) => {
            const id = getId(current);
            const itemSize = isHorizontal ? sizes[id]?.width : sizes[id]?.height;

            if (typeof itemSize === 'number') {
                acc.totalMeasured++;
                acc.totalSize += itemSize;
                acc.itemSizes[id] = itemSize;
            }
            return acc;
        },
        {
            totalSize: 0,
            totalMeasured: 0,
            itemSizes: {} as Record<string, number>,
        }
    );
    const avgSize = totalMeasured > 0 ? Math.ceil(totalSize / totalMeasured) : estimatedItemSize;

    const maxScrollSize =
        avgSize * Math.ceil(itemCountForCalc / itemsInRow) + itemGap * Math.ceil((itemCountForCalc - 1) / itemsInRow);

    const calcScrollPosition = () => {
        const lastWantedPixel = Math.min(
            scrollWindowSize * (1 + extraRenderedItems) + resolvedScroll - usedoffset,
            maxScrollSize
        );
        const firstWantedPixel = unmountItems ? lastWantedPixel - scrollWindowSize * (2 + extraRenderedItems) : 0;

        if (typeof itemSize === 'number') {
            let endIdx = Math.ceil(lastWantedPixel / itemSize);
            if (!unmountItems) {
                endIdx = lastRenderedItem.current.last = Math.max(endIdx, lastRenderedItem.current.last);
            }
            return {
                firstWantedPixel,
                lastWantedPixel,
                startIdx: unmountItems ? Math.ceil(firstWantedPixel / itemSize) : 0,
                endIdx,
            };
        }
        let taken = -itemGap;
        let firstTakenPixel: null | number = null;
        let startIdx = 0;
        for (let i = 0; i < items.length; i += itemsInRow) {
            let itemMaxSize = 0;

            for (let z = 0; z < itemsInRow && z + i < items.length; z++) {
                const id = getId(items[i + z]!);
                const itemSize = (isHorizontal ? sizes[id]?.width : sizes[id]?.height) ?? avgSize;
                itemMaxSize = Math.max(itemMaxSize, itemSize);
            }
            taken += itemMaxSize + itemGap;
            if (unmountItems && taken > firstWantedPixel && firstTakenPixel === null) {
                firstTakenPixel = taken - itemMaxSize;
                startIdx = i;
            }
            if (taken > lastWantedPixel) {
                let endIdx = i;
                if (!unmountItems) {
                    endIdx = lastRenderedItem.current.last = Math.max(endIdx, lastRenderedItem.current.last);
                }
                return {
                    firstWantedPixel: firstTakenPixel || 0,
                    lastWantedPixel: taken - itemMaxSize,
                    startIdx,
                    endIdx,
                };
            }
        }
        return {
            firstWantedPixel: firstTakenPixel || 0,
            startIdx,
            endIdx: Math.max(items.length, maxScrollSize / avgSize),
        };
    };
    const { endIdx, firstWantedPixel, startIdx } = calcScrollPosition();
    const style: React.CSSProperties = {
        position: 'relative',
    };

    useEffect(() => {
        if (loadingState === 'idle' && endIdx > items.length && loadMore) {
            const fetchItemsCount = Math.ceil(
                endIdx - items.length + (scrollWindowSize * (1 + extraRenderedItems)) / avgSize
            );
            if (fetchItemsCount > 0) {
                loadMore(fetchItemsCount);
            }
        }
    }, [loadingState, items, loadMore, scrollWindowSize, extraRenderedItems, avgSize, endIdx]);

    const rendereredItems = useMemo(() => items.slice(startIdx, endIdx), [items, endIdx, startIdx]);

    const innerStyle: React.CSSProperties = {
        position: 'absolute',
    };

    if (isHorizontal) {
        innerStyle.top = '0px';
        innerStyle.left = firstWantedPixel + 'px';
    } else {
        innerStyle.left = '0px';
        innerStyle.top = firstWantedPixel + 'px';
    }
    const overlayStyle: React.CSSProperties = {
        ...innerStyle,
        width: '100%',
        height: '100%',
    };
    const listRootWithStyle = forwardListRoot(listRoot || defaultRoot, {
        style: innerStyle,
        ref: listRef,
    });
    return (
        <RootSlot
            slot={scrollListRoot}
            props={{
                style,
                className: classes.root,
                ref: actualRef,
            }}
        >
            <List<T, EL>
                getId={getId}
                ItemRenderer={ItemRenderer}
                listRoot={listRootWithStyle}
                items={rendereredItems}
                focusControl={[focused, setFocused]}
                selectionControl={[selected, setSelected]}
                transmitKeyPress={transmitKeyPress}
            />
            {overlay ? (
                <ListOverlaySlot
                    slot={overlay}
                    props={{
                        itemSizes,
                        shownItems: rendereredItems,
                        avgSize,
                        style: overlayStyle,
                    }}
                />
            ) : null}
            <div
                style={{
                    height: `${maxScrollSize + 1}px`,
                }}
            >
                {loadingState === 'loading' ? <PreloaderSlot slot={preloader} /> : null}
            </div>
        </RootSlot>
    );
}

export function dimToSize<T>(
    itemSize: number | ((t: ItemInfo<T>) => number) | boolean,
    getItemInfo: (t: T) => ItemInfo<T>
): boolean | WatchedSize | ((t: T) => WatchedSize) {
    if (typeof itemSize === 'boolean') {
        return itemSize;
    }
    if (typeof itemSize === 'number') {
        return {
            width: itemSize,
            height: itemSize,
        };
    }

    return (t: T) => {
        const info = getItemInfo(t);
        const dim = itemSize(info);
        return {
            width: dim,
            height: dim,
        };
    };
}
