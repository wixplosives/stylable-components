import { useScrollListItemsDimensions } from '../hooks';
import React, { useCallback, useMemo, useRef } from 'react';
import type { ElementSlot, PropMapping } from '../common/types';
import { useElementDimension } from '../hooks/use-element-rect';
import { concatClasses, defaultRoot, defineElementSlot, mergeObjectInternalWins } from '../hooks/use-element-slot';
import { useScroll } from '../hooks/use-scroll';
import { useScrollListItemsSizes } from '../hooks/use-scroll-list-items-sizes';
import { ScrollListInfiniteProps, useScrollListMaybeLoadMore } from '../hooks/use-scroll-list-maybe-load-more';
import { ScrollListPositioningProps, useScrollListPosition } from '../hooks/use-scroll-list-position';
import { useScrollListScrollToSelected } from '../hooks/use-scroll-list-scroll-to-selected';
import { useScrollListStyles } from '../hooks/use-scroll-list-styles';
import { ProcessedControlledState, useStateControls } from '../hooks/use-state-controls';
import { List, ListProps, listRootParent } from '../list/list';
import { Preloader } from '../preloader/preloader';
import { classes as preloaderCSS } from '../preloader/variants/circle-preloader.st.css';
import { classes } from './scroll-list.st.css';

type ScrollListRootMinimalProps = Pick<
    React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>,
    'children' | 'style' | 'ref' | 'className'
>;

const defaultPreloader: ElementSlot<{}> = {
    el: Preloader,
    props: {
        className: preloaderCSS.root,
    },
};
const ScrollListRootPropMapping: PropMapping<ScrollListRootMinimalProps> = {
    style: mergeObjectInternalWins,
    className: concatClasses,
};
const { forward: forwardListRoot, slot: listRoot } = listRootParent(defaultRoot, ScrollListRootPropMapping);
const { Slot: PreloaderSlot } = defineElementSlot(defaultPreloader, {});

export interface ScrollListItemInfo<T> {
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

export const {
    forward: forwardScrollListRoot,
    slot: scrollListRoot,
    Slot: RootSlot,
} = defineElementSlot<ScrollListRootMinimalProps, typeof ScrollListRootPropMapping>(
    defaultRoot,
    ScrollListRootPropMapping
);

export const { parentSlot: scrollListOverlayParent, Slot: ListOverlaySlot } = defineElementSlot<OverlayProps<any>, {}>(
    defaultPreloader,
    {}
);
/**
 * size of the item in pixels or a method to compute according to data;
 * if omitted, item size will be measured and watched for changes;
 *
 * @default false
 */
export type ItemSizeOptions<I> = number | ((info: I) => number) | false;

export interface ScrollListProps<T, EL extends HTMLElement, I extends ScrollListItemInfo<T> = ScrollListItemInfo<T>>
    extends ListProps<T>,
        ScrollListPositioningProps,
        ScrollListInfiniteProps {
    /**
     * @default false
     */
    isHorizontal?: boolean;
    /**
     * @default false
     */
    itemSize?: ItemSizeOptions<I>;
    /**
     * size of the item ( height if vertical ) in pixels;
     * used if item size is not fixed
     *
     * @default 50
     */
    estimatedItemSize?: number;
    /**
     * size to render after scroll window size
     * 0.5 means rendering the half the scroll window size
     *
     * @default 0.5
     */
    extraRenderSize?: number;
    /**
     * element to watch for scroll and size updates;
     *
     * @default Window
     */
    scrollWindow?: React.RefObject<EL>;
    /**
     * number: use it as size;
     * true: measure on changes;
     * false: no remeasure;
     *
     * @default false
     */
    watchScrollWindowSize?: number | boolean;
    /**
     * allows replacing the root element of the scroll list
     */
    scrollListRoot?: typeof scrollListRoot;
    /**
     * allows replacing the element of the list
     *
     */
    listRoot?: typeof listRoot;
    preloader?: ElementSlot<{}>;
    overlay?: ElementSlot<OverlayProps<T>>;
}

export function ScrollList<T, EL extends HTMLElement = HTMLDivElement>({
    items,
    isHorizontal = false,
    scrollWindow,
    watchScrollWindowSize,
    itemCount,
    getId,
    ItemRenderer,
    estimatedItemSize,
    focusControl,
    loadMore,
    scrollOffset,
    itemSize = false,
    scrollListRoot,
    listRoot,
    selectionControl,
    extraRenderSize = 0.5,
    unmountItems,
    preloader,
    loadingState,
    itemGap = 0,
    itemsInRow = 1,
    transmitKeyPress,
    overlay,
}: ScrollListProps<T, EL>): JSX.Element {
    const defaultScrollListRef = useRef<EL>();
    const scrollListRef = (scrollListRoot?.props?.ref as React.RefObject<HTMLElement>) || defaultScrollListRef;
    const defaultListRef = useRef<HTMLElement>(null);
    const listRef = (listRoot?.props?.ref as React.RefObject<HTMLDivElement>) || defaultListRef;
    /**
     * get scroll position of scrollWindow and trigger re-rendering on its change
     */
    const scrollPosition = useScroll({
        isHorizontal,
        ref: scrollWindow,
    });
    const [selected, setSelected] = useStateControls(selectionControl, undefined);
    const [focused, setFocused] = useStateControls(focusControl, undefined);
    const scrollWindowSize = useElementDimension(scrollWindow, !isHorizontal, watchScrollWindowSize);

    const getItemInfo = useCallback(
        (data: T): ScrollListItemInfo<T> => ({
            data,
            isFocused: focused === getId(data),
            isSelected: selected === getId(data),
        }),
        [getId, focused, selected]
    );

    const getItemSize = useMemo(() => {
        if (itemSize === false) {
            return itemSize;
        }

        if (typeof itemSize === 'number') {
            return {
                width: itemSize,
                height: itemSize,
            };
        }

        return (item: T) => {
            const itemInfo = getItemInfo(item);
            const dimension = itemSize(itemInfo) ?? 0;

            return {
                width: dimension,
                height: dimension,
            };
        };
    }, [itemSize, getItemInfo]);

    const itemsDimensions = useScrollListItemsDimensions(listRef, items, getId, getItemSize, true);

    const { itemsSizes, averageItemSize } = useScrollListItemsSizes({
        itemsDimensions,
        isHorizontal,
        items,
        getId,
        estimatedItemSize,
    });

    const itemsNumber = useMemo(
        () => (itemCount === undefined ? items.length : itemCount === -1 ? items.length + 5000 : itemCount),
        [itemCount, items.length]
    );

    // THIS IS APPROXIMATION!
    const maxScrollSize = useMemo(() => {
        const rowsNumbers = Math.ceil(itemsNumber / itemsInRow);
        const gapsNumber = Math.ceil((itemsNumber - 1) / itemsInRow);

        return averageItemSize * rowsNumbers + itemGap * gapsNumber;
    }, [itemGap, itemsInRow, itemsNumber, averageItemSize]);

    const { firstShownItemIndex, lastShownItemIndex, firstWantedPixel } = useScrollListPosition({
        items,
        getId,
        getItemInfo,
        maxScrollSize,
        itemSize,
        itemGap,
        itemsInRow,
        averageItemSize,
        isHorizontal,
        unmountItems,
        extraRenderSize,
        scrollWindowSize,
        itemsDimensions,
        scrollPosition,
        scrollOffset,
        scrollListRef,
    });

    useScrollListMaybeLoadMore({
        loadMore,
        extraRenderSize,
        loadingState,
        scrollWindowSize,
        lastShownItemIndex,
        averageItemSize,
        loadedItemsNumber: items.length,
    });

    useScrollListScrollToSelected({
        scrollWindow,
        scrollListRef,
        items,
        getId,
        selected,
        averageItemSize,
        isHorizontal,
        extraRenderSize,
        scrollWindowSize,
        itemsDimensions,
    });

    const shownItems = useMemo(
        () => items.slice(firstShownItemIndex, lastShownItemIndex),
        [items, firstShownItemIndex, lastShownItemIndex]
    );
    const { scrollListStyle, listStyle, overlayStyle } = useScrollListStyles({ isHorizontal, firstWantedPixel });

    // TODO: causes re-rendering which I think is not needed
    const listRootWithStyle = forwardListRoot(listRoot || defaultRoot, {
        style: listStyle,
        ref: listRef,
    });

    const focusControlMemoized: ProcessedControlledState<string | undefined> = useMemo(
        () => [focused, setFocused],
        [focused, setFocused]
    );
    const selectionControlMemoized: ProcessedControlledState<string | undefined> = useMemo(
        () => [selected, setSelected],
        [selected, setSelected]
    );

    return (
        <RootSlot
            slot={scrollListRoot}
            props={{
                className: classes.root,
                style: scrollListStyle,
                ref: scrollListRef,
            }}
        >
            <List<T, EL>
                items={shownItems}
                getId={getId}
                ItemRenderer={ItemRenderer}
                listRoot={listRootWithStyle}
                focusControl={focusControlMemoized}
                selectionControl={selectionControlMemoized}
                transmitKeyPress={transmitKeyPress}
            />
            {overlay ? (
                <ListOverlaySlot
                    slot={overlay}
                    props={{
                        itemSizes: itemsSizes,
                        shownItems,
                        avgSize: averageItemSize,
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
