import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { defaultRoot } from '../hooks/use-element-slot';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { KeyCodes } from '../keycodes';
import { forwardListRoot, ListItemProps } from '../list/list';
import {
    ScrollListItemInfo,
    OverlayProps,
    ScrollList,
    scrollListOverlayParent,
    ScrollListProps,
} from '../scroll-list/scroll-list';
// import { st, classes } from './tree.st.css';

export interface TreeItemInfo<T> extends ScrollListItemInfo<T> {
    isOpen: boolean;
    hasChildren: boolean;
}

export interface TreeItemProps<T> extends ListItemProps<T> {
    isOpen: boolean;
    hasChildren: boolean;
    open(): void;
    close(): void;
    indent: number;
}

export interface TreeOverlayProps<T> extends OverlayProps<T> {
    expandedItems: string[];
}

export const {
    forward: forwardListOverlay,
    slot: overlayRoot,
    Slot: TreeOverlay,
    create: createTreeOverlay,
    parentSlot: defineTreeParentOverlay,
} = scrollListOverlayParent<{
    expandedItems: string[];
}>(defaultRoot);

export interface TreeAddedProps<T> {
    data: T;
    getChildren: (t: T) => T[];
    openItemsControls: StateControls<string[]>;

    ItemRenderer: React.ComponentType<TreeItemProps<T>>;

    overlay?: typeof overlayRoot;
}

export type TreeProps<T, EL extends HTMLElement> = Omit<
    ScrollListProps<T, EL, TreeItemInfo<T>>,
    'items' | 'ItemRenderer'
> &
    TreeAddedProps<T>;

export type Tree<T, EL extends HTMLElement = HTMLDivElement> = (props: TreeProps<T, EL>) => JSX.Element;

export function Tree<T, EL extends HTMLElement = HTMLElement>(props: TreeProps<T, EL>): JSX.Element {
    const {
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
    const [openItems, updateOpenItems] = useStateControls(openItemsControls, []);
    const [focused, updateFocused] = useStateControls(focusControl, undefined);
    const { items, depths } = getItems({ data, getChildren, getId, openItems });
    const itemRenderer = useMemo(() => TreeItemWrapper(ItemRenderer), [ItemRenderer]);

    const wrapperContext = useMemo(
        () => ({
            open(id: string) {
                if (!openItems.includes(id)) {
                    updateOpenItems([...openItems, id]);
                }
            },
            close(id: string) {
                if (openItems.includes(id)) {
                    updateOpenItems(openItems.filter((item) => item !== id));
                }
            },
            openItems,
            getChildren: getChildren as (t: unknown) => unknown[],
            getDepth(id: string) {
                return depths[id] || 0;
            },
        }),
        [openItems, getChildren, updateOpenItems, depths]
    );
    const updatedListRoot = forwardListRoot(listRoot, {
        onKeyDown: useCallback(
            (ev: React.KeyboardEvent) => {
                if (ev.code === KeyCodes.ArrowLeft && focused && openItems.includes(focused)) {
                    wrapperContext.close(focused);
                }
                if (ev.code === KeyCodes.ArrowRight && focused && !openItems.includes(focused)) {
                    wrapperContext.open(focused);
                }
            },
            [focused, openItems, wrapperContext]
        ),
    });

    const updatedOverlay = forwardListOverlay(props.overlay, {
        expandedItems: openItems,
    });

    const listItemSize = useMemo(() => {
        if (typeof itemSize !== 'function') {
            return itemSize;
        }
        return (info: ScrollListItemInfo<T>) => {
            const isOpen = openItems.includes(getId(info.data));
            const hasChildren = getChildren(info.data).length > 0;
            return itemSize({
                ...info,
                isOpen,
                hasChildren,
            });
        };
    }, [getChildren, getId, itemSize, openItems]);
    return (
        <treeWrapperContext.Provider value={wrapperContext}>
            <ScrollList
                {...scrollListProps}
                overlay={updatedOverlay}
                getId={getId}
                items={items}
                ItemRenderer={itemRenderer}
                listRoot={updatedListRoot}
                focusControl={[focused, updateFocused]}
                itemSize={listItemSize}
            />
        </treeWrapperContext.Provider>
    );
}

const treeWrapperContext = createContext({
    open: (_id: string) => {
        //
    },
    close: (_id: string) => {
        //
    },
    openItems: [] as string[],
    getChildren: (_t: unknown) => {
        return [] as unknown[];
    },
    getDepth: (_id: string) => 0 as number,
});

export function TreeItemWrapper<T>(
    UserRenderer: React.ComponentType<TreeItemProps<T>>
): (props: ListItemProps<T>) => JSX.Element {
    const Wrapper = (props: ListItemProps<T>) => {
        const { openItems, close, open, getChildren, getDepth } = useContext(treeWrapperContext);
        const boundClose = useCallback(() => close(props.id), [close, props.id]);
        const boundOpen = useCallback(() => open(props.id), [open, props.id]);
        const hasChildren = getChildren(props.data).length > 0;
        const depth = getDepth(props.id);
        return (
            <UserRenderer
                {...props}
                isOpen={openItems.includes(props.id)}
                open={boundOpen}
                close={boundClose}
                hasChildren={hasChildren}
                indent={depth}
            />
        );
    };
    Wrapper.displayName = 'TreeItemWrapper';
    return Wrapper;
}

export function getItems<T>({
    data,
    getId,
    getChildren,
    openItems,
    depth = 0,
    depths = {},
}: {
    data: T;
    getChildren: (t: T) => T[];
    getId: (t: T) => string;
    openItems: string[];
    depth?: number;
    depths?: Record<string, number>;
}): { items: T[]; depths: Record<string, number> } {
    const id = getId(data);
    depths[id] = depth;
    if (!openItems.includes(id)) {
        return {
            items: [data],
            depths,
        };
    }
    return {
        items: [
            data,
            ...getChildren(data).flatMap(
                (item) =>
                    getItems({
                        data: item,
                        getId,
                        getChildren,
                        openItems,
                        depth: depth + 1,
                        depths,
                    }).items
            ),
        ],
        depths,
    };
}
