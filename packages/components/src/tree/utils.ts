import { defaultRoot } from '../hooks/use-element-slot';
import { scrollListOverlayParent } from '../scroll-list/scroll-list';
import type { GetAllTreeItemsParams, GetTreeItemsParams } from './types';

export const {
    forward: forwardListOverlay,
    slot: overlayRoot,
    create: createTreeOverlay,
} = scrollListOverlayParent<{
    expandedItems: string[];
}>(defaultRoot);

export const getItems = <T>({
    item,
    getId,
    getChildren,
    openItemIds,
    depth = 0,
    treeItemDepths = {},
}: GetTreeItemsParams<T>): { items: T[]; treeItemDepths: Record<string, number> } => {
    const id = getId(item);
    treeItemDepths[id] = depth;

    if (!openItemIds.includes(id)) {
        return {
            items: [item],
            treeItemDepths,
        };
    }

    return {
        items: [
            item,
            ...getChildren(item).flatMap(
                (item) =>
                    getItems({
                        item: item,
                        getId,
                        getChildren,
                        openItemIds,
                        depth: depth + 1,
                        treeItemDepths,
                    }).items
            ),
        ],
        treeItemDepths,
    };
};

export const getAllTreeItems = <T>({ item, getChildren, getId }: GetAllTreeItemsParams<T>): T[] => [
    item,
    ...getChildren(item).flatMap((item) =>
        getAllTreeItems({
            item,
            getId,
            getChildren,
        })
    ),
];
