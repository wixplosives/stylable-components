import { RefObject, useMemo } from 'react';
import type { ListProps } from '../list/list';
import type { ScrollListItemInfo, ScrollListProps } from '../scroll-list/scroll-list';
import { useScrollListItemsDimensions } from './use-scroll-list-items-dimensions';

export const useScrollListItemsSizes = <T, EL extends HTMLElement = HTMLDivElement>({
    listRef,
    isHorizontal,
    items,
    getId,
    getItemInfo,
    itemSize = false,
    estimatedItemSize = 50,
}: {
    listRef: RefObject<EL>;
    isHorizontal: boolean;
    items: ListProps<T>['items'];
    getId: ListProps<T>['getId'];
    getItemInfo: (item: T) => ScrollListItemInfo<T>;
    itemSize?: ScrollListProps<T, EL>['itemSize'];
    estimatedItemSize?: ScrollListProps<T, EL>['estimatedItemSize'];
}) => {
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

    const { totalSize, itemsSizes, measuredItemsNumber } = useMemo(
        () =>
            items.reduce(
                (result, item) => {
                    const id = getId(item);
                    const size = isHorizontal ? itemsDimensions[id]?.width : itemsDimensions[id]?.height;

                    if (typeof size === 'number') {
                        result.totalSize += size;
                        result.itemsSizes[id] = size;
                        result.measuredItemsNumber++;
                    }

                    return result;
                },
                {
                    totalSize: 0,
                    itemsSizes: {} as Record<string, number>,
                    measuredItemsNumber: 0,
                }
            ),
        [isHorizontal, getId, items, itemsDimensions]
    );

    const averageItemSize = useMemo(
        () => (measuredItemsNumber > 0 ? Math.ceil(totalSize / measuredItemsNumber) : estimatedItemSize),
        [estimatedItemSize, totalSize, measuredItemsNumber]
    );

    return {
        itemsSizes,
        itemsDimensions,
        averageItemSize,
    };
};
