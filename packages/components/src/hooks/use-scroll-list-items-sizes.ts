import { MutableRefObject, useMemo } from 'react';
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
    itemsDimensions: MutableRefObject<DimensionsById>;
}) => {
    const { totalSize, itemsSizes, measuredItemsNumber } = useMemo(
        () =>
            items.reduce(
                (result, item) => {
                    const id = getId(item);
                    const size = isHorizontal
                        ? itemsDimensions.current[id]?.width
                        : itemsDimensions.current[id]?.height;

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
        [items, getId, isHorizontal, itemsDimensions]
    );

    const averageItemSize = useMemo(
        () => (measuredItemsNumber > 0 ? Math.ceil(totalSize / measuredItemsNumber) : estimatedItemSize),
        [estimatedItemSize, totalSize, measuredItemsNumber]
    );

    return {
        itemsSizes,
        averageItemSize,
    };
};
