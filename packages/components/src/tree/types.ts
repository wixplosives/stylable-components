import type React from 'react';
import type { StateControls } from '../hooks';
import type { ListItemProps } from '../list/list';
import type { OverlayProps, ScrollListItemInfo, ScrollListProps } from '../scroll-list/scroll-list';
import type { overlayRoot } from './utils';

export interface TreeItemInfo<T> extends ScrollListItemInfo<T> {
    isOpen: boolean;
    hasChildren: boolean;
}

export interface TreeItemProps<T> extends ListItemProps<T> {
    isOpen: boolean;
    hasChildren: boolean;
    indent: number;

    open(): void;

    close(): void;
}

export interface TreeOverlayProps<T> extends OverlayProps<T> {
    expandedItems: string[];
}

export type GetChildren<T> = (t: T) => T[];
export type GetId<T> = (t: T) => string;

export interface TreeAddedProps<T, EL extends HTMLElement> {
    data: T;
    getChildren: GetChildren<T>;
    openItemsControls: StateControls<string[]>;
    eventsRoot?: React.RefObject<EL>;
    ItemRenderer: React.ComponentType<TreeItemProps<T>>;
    overlay?: typeof overlayRoot;
}

export type TreeProps<T, EL extends HTMLElement> = Omit<
    ScrollListProps<T, EL, TreeItemInfo<T>>,
    'items' | 'ItemRenderer'
> &
    TreeAddedProps<T, EL>;

export interface TreeWrapperContext<T = any> {
    openItemIds: string[];
    getChildren: GetChildren<T>;
    getDepth: (itemId: string) => number;
    open: (itemId: string) => void;
    close: (itemId: string) => void;
}

export interface GetAllTreeItemsParams<T> {
    item: T;
    getChildren: GetChildren<T>;
    getId: GetId<T>;
}

export interface GetTreeItemsParams<T> extends GetAllTreeItemsParams<T> {
    openItemIds: string[];
    depth?: number;
    treeItemDepths?: Record<string, number>;
}
