import { RefObject, useCallback, useMemo } from 'react';
import { useIdBasedRects } from '../../hooks/use-element-rect';
import type { ItemInfo, ScrollListProps } from '../scroll-list';

export interface ScrollListItemsSizeProps<T> {
    /**
     * size of the item ( height if vertical ) in pixels or a method to compute according to data;
     * if omitted, item size will be measured
     *
     * @default false
     */
    itemSize?: number | ((info: ItemInfo<T>) => number) | boolean;
    /**
     * size of the item ( height if vertical ) in pixels;
     * used if item size is not fixed
     *
     * @default 50
     */
    estimatedItemSize?: number;
}
export const useScrollListItemsSizes = <T, EL extends HTMLElement>({
    items,
    getId,
    itemSize = false,
    isHorizontal,
    estimatedItemSize = 50,
    focused,
    actualListRef,
    selected,
}: ScrollListItemsSizeProps<T> & {
    items: ScrollListProps<T, EL>['items'];
    getId: ScrollListProps<T, EL>['getId'];
    isHorizontal: ScrollListProps<T, EL>['isHorizontal'];
    actualListRef: RefObject<HTMLDivElement>;
    focused?: string; // TODO: not only string ;-( useStateControls really
    selected?: string; // TODO: not only string ;-( useStateControls really
}) => {
    const getItemInfo = useCallback(
        (data: T): ItemInfo<T> => ({
            data,
            isFocused: focused === getId(data),
            isSelected: selected === getId(data),
        }),
        [focused, selected, getId]
    );

    const size = useMemo(() => {
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
            const dim = itemSize?.(info) ?? 0;
            return {
                width: dim,
                height: dim,
            };
        };
    }, [itemSize, getItemInfo]);

    const sizes = useIdBasedRects(actualListRef, items, getId, size, true);

    const { totalSize, itemSizes, measuredItemsNumber } = useMemo(
        () =>
            items.reduce(
                (data, current) => {
                    const id = getId(current);
                    const itemSize = isHorizontal ? sizes[id]?.width : sizes[id]?.height;

                    if (typeof itemSize === 'number') {
                        data.totalSize += itemSize;
                        data.itemSizes[id] = itemSize;
                        data.measuredItemsNumber++;
                    }

                    return data;
                },
                {
                    totalSize: 0,
                    itemSizes: {} as Record<string, number>,
                    measuredItemsNumber: 0,
                }
            ),
        [getId, isHorizontal, items, sizes]
    );

    const avgItemSize = useMemo(
        () => (measuredItemsNumber > 0 ? Math.ceil(totalSize / measuredItemsNumber) : estimatedItemSize),
        [totalSize, measuredItemsNumber, estimatedItemSize]
    );

    return {
        totalSize,
        itemSizes,
        measuredItemsNumber,
        avgItemSize,
        sizes,
    };
};
