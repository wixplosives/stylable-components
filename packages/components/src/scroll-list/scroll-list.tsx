import React, { useMemo, useRef } from 'react';
import type { ElementSlot, PropMapping } from '../common/types';
import { useElementDimension } from '../hooks/use-element-rect';
import { concatClasses, defaultRoot, defineElementSlot, mergeObjectInternalWins } from '../hooks/use-element-slot';
import { useScroll } from '../hooks/use-scroll';
import { useStateControls } from '../hooks/use-state-controls';
import { List, ListProps, listRootParent } from '../list/list';
import { Preloader } from '../preloader/preloader';
import { classes as preloaderCSS } from '../preloader/variants/circle-preloader.st.css';
import { ScrollListItemsSizeProps, useScrollListItemsSizes } from './hooks/use-scroll-list-items-sizes';
import { ScrollListInfiniteProps, useScrollListMaybeLoadMore } from './hooks/use-scroll-list-maybe-load-more';
import { ScrollListPositioningProps, useScrollListPosition } from './hooks/use-scroll-list-position';
import { useScrollListScrollToSelected } from './hooks/use-scroll-list-scroll-to-selected';
import { useScrollListStyles } from './hooks/use-scroll-list-styles';
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

export const {
    forward: forwardScrollListRoot,
    slot: scrollListRoot,
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

export const { parentSlot: scrollListOverlayParent, Slot: ListOverlaySlot } = defineElementSlot<OverlayProps<any>, {}>(
    defaultPreloader,
    {}
);

export interface ScrollListProps<T, EL extends HTMLElement>
    extends ListProps<T>,
        ScrollListItemsSizeProps<T>,
        ScrollListPositioningProps,
        ScrollListInfiniteProps {
    /**
     * @default false
     */
    isHorizontal?: boolean;
    /**
     * size to render after scroll window size
     * 0.5 means rendering the half the scroll window size
     *
     * @default 0.5
     */
    extraRenderSize?: number;
    /**
     * element to watch for scroll and size updates, if omitted will use the window
     */
    scrollWindow?: React.RefObject<EL>;
    /*
     *   false: no remeasure,
     *   true: measure on changes,
     *   number: use the number as size
     *
     * @default false
     */
    watchScrollWindowSize?: number | boolean;
    /**
     * allows replacing the root element of the scroll list
     */
    scrollListRoot?: typeof scrollListRoot;

    preloader?: ElementSlot<{}>;
    overlay?: ElementSlot<OverlayProps<T>>;
    listRoot?: typeof listRoot;
}

export type ScrollList<T, EL extends HTMLElement = HTMLDivElement> = (props: ScrollListProps<T, EL>) => JSX.Element;

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
    itemSize,
    scrollListRoot,
    listRoot,
    selectionControl,
    extraRenderSize = 0.5,
    unmountItems,
    preloader,
    loadingState,
    itemGap,
    itemsInRow,
    transmitKeyPress,
    overlay,
}: ScrollListProps<T, EL>): JSX.Element {
    const defaultRef = useRef<EL>();
    const actualRef = (scrollListRoot?.props?.ref as React.RefObject<HTMLElement>) || defaultRef;
    const defaultListRef = useRef<HTMLElement>(null);
    const actualListRef = (listRoot?.props?.ref as React.RefObject<HTMLDivElement>) || defaultListRef;
    const scrollPosition = useScroll({
        isHorizontal,
        ref: scrollWindow,
    });
    const [selected, setSelected] = useStateControls(selectionControl, undefined);
    const [focused, setFocused] = useStateControls(focusControl, undefined);

    const scrollWindowSize = useElementDimension(scrollWindow, !isHorizontal, watchScrollWindowSize);

    const { itemSizes, avgItemSize, sizes } = useScrollListItemsSizes({
        items,
        itemSize,
        selected,
        focused,
        getId,
        isHorizontal,
        estimatedItemSize,
        actualListRef,
    });

    const { maxScrollSize, firstShownItemIndex, lastShownItemIndex, firstWantedPixel } = useScrollListPosition({
        items,
        itemCount,
        itemSize,
        itemGap,
        itemsInRow,
        getId,
        focused,
        selected,
        avgItemSize,
        isHorizontal,
        unmountItems,
        extraRenderSize,
        scrollWindowSize,
        sizes,
        scrollPosition,
        scrollOffset,
        actualRef,
    });

    useScrollListMaybeLoadMore({
        loadMore,
        extraRenderSize,
        loadingState,
        scrollWindowSize,
        lastShownItemIndex,
        avgItemSize,
        loadedItemsNumber: items.length,
    });

    useScrollListScrollToSelected({
        scrollWindow,
        selected,
        firstShownItemIndex,
        lastShownItemIndex,
        scrollWindowSize,
        items,
        getId,
        avgItemSize,
        extraRenderSize,
        maxScrollSize,
    });

    const shownItems = useMemo(
        () => items.slice(firstShownItemIndex, lastShownItemIndex),
        [items, firstShownItemIndex, lastShownItemIndex]
    );
    const { wrapperStyle, listStyle, overlayStyle } = useScrollListStyles({ isHorizontal, firstWantedPixel });

    const listRootWithStyle = forwardListRoot(listRoot || defaultRoot, {
        style: listStyle,
        ref: actualListRef,
    });

    return (
        <RootSlot
            slot={scrollListRoot}
            props={{
                className: classes.root,
                style: wrapperStyle,
                ref: actualRef,
            }}
        >
            <List<T, EL>
                getId={getId}
                ItemRenderer={ItemRenderer}
                listRoot={listRootWithStyle}
                items={shownItems}
                focusControl={[focused, setFocused]}
                selectionControl={[selected, setSelected]}
                transmitKeyPress={transmitKeyPress}
            />
            {overlay ? (
                <ListOverlaySlot
                    slot={overlay}
                    props={{
                        itemSizes,
                        shownItems,
                        avgSize: avgItemSize,
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
