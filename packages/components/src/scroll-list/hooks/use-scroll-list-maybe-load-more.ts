import { useEffect } from 'react';

export type ScrollListLoadingState = 'loading' | 'idle' | 'done';

export interface ScrollListInfiniteProps {
    /**
     * if provided the list will request more items when reaching the scroll length
     * you must manage the loading state as well for loadMore to work
     */
    loadMore?: (count: number) => unknown;
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
     * Total number of items in the list. Note that only a few items will be rendered and displayed at a time.
     * -1 implies the list is infinite;
     * undefined implies it is the same length as the data
     */
    itemCount?: number;
}

export const useScrollListMaybeLoadMore = ({
    loadMore,
    loadingState,
    extraRenderSize,
    scrollWindowSize,
    lastShownItemIndex,
    loadedItemsNumber,
    avgItemSize,
}: ScrollListInfiniteProps & {
    extraRenderSize: number;
    scrollWindowSize: number;
    lastShownItemIndex: number;
    loadedItemsNumber: number;
    avgItemSize: number;
}) => {
    useEffect(() => {
        if (loadMore && loadingState === 'idle' && lastShownItemIndex > loadedItemsNumber) {
            const itemsToFetchCount = Math.ceil(
                lastShownItemIndex - loadedItemsNumber + (scrollWindowSize * (1 + extraRenderSize)) / avgItemSize
            );
            if (itemsToFetchCount > 0) {
                loadMore(itemsToFetchCount);
            }
        }
    }, [loadMore, extraRenderSize, loadingState, scrollWindowSize, lastShownItemIndex, loadedItemsNumber, avgItemSize]);
};
