import type React from 'react';
import type { StateControls } from '../hooks/index.js';
import type {
    KeyboardInteractionConfiguration,
    KeyboardSelectMeta,
    TreeViewKeyboardInteractionsParams,
} from '../hooks/use-tree-view-keyboard-interaction.js';
import type { ListItemProps } from '../list/list.js';
import type { OverlayProps, ScrollListItemInfo, ScrollListProps } from '../scroll-list/scroll-list.js';
import type { overlayRoot } from './utils.js';
import { ListSelection } from '../list/types.js';

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

export interface TreeAddedProps<T> {
    data: T;
    getChildren: GetChildren<T>;
    openItemsControls: StateControls<string[]>;
    eventRoots?: TreeViewKeyboardInteractionsParams['eventRoots'];
    ItemRenderer: React.ComponentType<TreeItemProps<T>>;
    selectionControl?: StateControls<ListSelection, KeyboardSelectMeta | undefined>;
    overlay?: typeof overlayRoot;
}

export type TreeProps<T, EL extends HTMLElement> = Omit<
    ScrollListProps<T, EL, TreeItemInfo<T>>,
    'items' | 'ItemRenderer' | 'selectionControl'
> &
    TreeAddedProps<T> &
    KeyboardInteractionConfiguration;

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
