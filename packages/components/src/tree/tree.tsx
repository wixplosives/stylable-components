import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useStateControls } from '../hooks/use-state-controls';
import { useTreeViewKeyboardInteraction } from '../hooks/use-tree-view-keyboard-interaction';
import type { ListItemProps } from '../list/list';
import { ScrollList, type ScrollListItemInfo } from '../scroll-list/scroll-list';
import type { TreeItemProps, TreeProps, TreeWrapperContext } from './types';
import { forwardListOverlay, getAllTreeItems, getItems } from './utils';

const treeWrapperContext = createContext<TreeWrapperContext>({
    openItemIds: [],
    getChildren: () => [],
    getDepth: () => 0,
    open: () => void 0,
    close: () => void 0,
});

export const TreeItemWrapper = <T,>(
    UserRenderer: React.ComponentType<TreeItemProps<T>>
): ((props: ListItemProps<T>) => JSX.Element) => {
    const Wrapper = (props: ListItemProps<T>) => {
        const { openItemIds, close, open, getChildren, getDepth } = useContext(treeWrapperContext);
        const boundClose = useCallback(() => close(props.id), [close, props.id]);
        const boundOpen = useCallback(() => open(props.id), [open, props.id]);
        const hasChildren = getChildren(props.data).length > 0;
        const depth = getDepth(props.id);

        return (
            <UserRenderer
                {...props}
                isOpen={openItemIds.includes(props.id)}
                open={boundOpen}
                close={boundClose}
                hasChildren={hasChildren}
                indent={depth}
            />
        );
    };

    Wrapper.displayName = 'TreeItemWrapper';
    return Wrapper;
};

export function Tree<T, EL extends HTMLElement = HTMLElement>(props: TreeProps<T, EL>): JSX.Element {
    const {
        eventRoots,
        listRoot,
        data,
        getChildren,
        openItemsControls,
        getId,
        ItemRenderer,
        focusControl,
        itemSize,
        ...scrollListProps
    } = props;
    const [openItemIds, setOpenItemIds] = useStateControls(openItemsControls, []);
    const [focusedItemId, focus] = useStateControls(focusControl, undefined);
    const [, select] = useStateControls(scrollListProps.selectionControl, undefined);
    const { items, treeItemDepths } = useMemo(
        () => getItems({ item: data, getChildren, getId, openItemIds }),
        [data, getChildren, getId, openItemIds]
    );
    const treeItems = useMemo(() => getAllTreeItems({ item: data, getChildren, getId }), [data, getChildren, getId]);

    const getParent = useCallback(
        (itemId: string) => {
            const parent = treeItems.find((potentialParent) =>
                getChildren(potentialParent).some((item) => getId(item) === itemId)
            );

            return parent && getId(parent);
        },
        [getChildren, getId, treeItems]
    );

    const getFirstChild = useCallback(
        (itemId: string) => {
            const item = treeItems.find((item) => getId(item) === itemId);
            const children = item && getChildren(item);
            const firstChild = children?.[0];

            return firstChild && getId(firstChild);
        },
        [getChildren, getId, treeItems]
    );

    const isEndNode = useCallback(
        (itemId: string) => {
            const item = treeItems.find((item) => getId(item) === itemId);
            const children = item && getChildren(item);

            return children?.length === 0;
        },
        [getChildren, getId, treeItems]
    );

    const isOpen = useCallback((itemId: string) => openItemIds.includes(itemId), [openItemIds]);

    const getDepth = useCallback((itemId: string) => treeItemDepths[itemId] || 0, [treeItemDepths]);

    const getPrevious = useCallback(
        (itemId: string) => {
            const focusedIndex = items.findIndex((item) => getId(item) === itemId);
            const prevIndex = focusedIndex - 1;
            const prevItem = items[prevIndex];

            return prevItem ? getId(prevItem) : undefined;
        },
        [items, getId]
    );

    const getNext = useCallback(
        (itemId: string) => {
            const focusedIndex = items.findIndex((item) => getId(item) === itemId);
            const nextIndex = focusedIndex + 1;
            const nextItem = items[nextIndex];

            return nextItem ? getId(nextItem) : undefined;
        },
        [items, getId]
    );

    const getFirst = useCallback(() => {
        const firstItem = items[0];

        return firstItem ? getId(firstItem) : undefined;
    }, [items, getId]);

    const getLast = useCallback(() => {
        const lastItem = items[items.length - 1];

        return lastItem ? getId(lastItem) : undefined;
    }, [items, getId]);

    const open = useCallback(
        (id: string) => {
            if (!isOpen(id)) {
                setOpenItemIds([...openItemIds, id]);
            }
        },
        [isOpen, openItemIds, setOpenItemIds]
    );

    const close = useCallback(
        (id: string) => {
            if (isOpen(id)) {
                setOpenItemIds(openItemIds.filter((itemId) => itemId !== id));
            }
        },
        [isOpen, openItemIds, setOpenItemIds]
    );

    useTreeViewKeyboardInteraction({
        eventRoots,
        focusedItemId,
        isOpen,
        isEndNode,
        getPrevious,
        getFirst,
        getLast,
        getNext,
        getParent,
        getFirstChild,
        open,
        close,
        focus,
        select,
    });

    const overlay = forwardListOverlay(props.overlay, {
        expandedItems: openItemIds,
    });

    const listItemSize = useMemo(() => {
        if (typeof itemSize !== 'function') {
            return itemSize;
        }
        return (info: ScrollListItemInfo<T>) =>
            itemSize({
                ...info,
                isOpen: isOpen(getId(info.data)),
                hasChildren: getChildren(info.data).length > 0,
            });
    }, [getChildren, getId, isOpen, itemSize]);

    const itemRenderer = useMemo(() => TreeItemWrapper(ItemRenderer), [ItemRenderer]);

    return (
        <treeWrapperContext.Provider
            value={{
                open,
                close,
                openItemIds,
                getChildren,
                getDepth,
            }}
        >
            <ScrollList
                {...scrollListProps}
                overlay={overlay}
                getId={getId}
                items={items}
                ItemRenderer={itemRenderer}
                listRoot={listRoot}
                focusControl={[focusedItemId, focus]}
                itemSize={listItemSize}
            />
        </treeWrapperContext.Provider>
    );
}
