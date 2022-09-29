import { useMemo } from 'react';
import type { DimensionsById } from '../hooks/use-element-rect';
import type { ListProps } from '../list/list';
import type { ScrollListProps } from '../scroll-list/scroll-list';

export const useScrollListItemsSizes = <T, EL extends HTMLElement = HTMLDivElement>({
    isHorizontal,
    items,
    getId,
    estimatedItemSize = 50,
    itemsDimensions,
}: {
    isHorizontal: boolean;
    items: ListProps<T>['items'];
    getId: ListProps<T>['getId'];
    estimatedItemSize?: ScrollListProps<T, EL>['estimatedItemSize'];
    itemsDimensions: DimensionsById;
}) => {
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
