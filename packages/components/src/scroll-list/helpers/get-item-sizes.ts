import type { DimensionsById } from '../../common';
import type { ListProps } from '../../list/list';
import type { ScrollListProps } from '../scroll-list';

export const getItemSizes = <T, EL extends HTMLElement = HTMLDivElement>({
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
    const { totalSize, itemsSizes, measuredItemsNumber } = items.reduce(
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
    );

    const averageItemSize = measuredItemsNumber > 0 ? Math.ceil(totalSize / measuredItemsNumber) : estimatedItemSize;

    return {
        itemsSizes,
        averageItemSize,
    };
};
