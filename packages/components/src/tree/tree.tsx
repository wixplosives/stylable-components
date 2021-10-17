import React from 'react';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import type { ListItemProps } from '../list/list';
import { ScrollList, ScrollListProps } from '../scroll-list/scroll-list';
// import { st, classes } from './tree.st.css';

export interface TreeItemProps<T> extends ListItemProps<T> {
    isOpen: boolean;
}

export interface TreeAddedProps<T> {
    data: T;
    getChildren: (t: T) => T[];
    openItemsControls: StateControls<string[]>;
    openItemsByDefault: false;
}

export type TreeProps<T, EL extends HTMLElement> = Omit<ScrollListProps<T, EL>, 'items'> & TreeAddedProps<T>;

export type Tree<T, EL extends HTMLElement = HTMLDivElement> = (props: TreeProps<T, EL>) => JSX.Element;

export function Tree<T, EL extends HTMLElement = HTMLElement>(props: TreeProps<T, EL>): JSX.Element {
    const { data, getChildren, openItemsControls, openItemsByDefault, getId, ...scrollListProps } = props;
    const [openItems, _updateOpenItems] = useStateControls(openItemsControls || [[]]);

    const items = getItems({ data, getChildren, getId, openItems, openItemsByDefault });

    return <ScrollList {...scrollListProps} getId={getId} items={items} />;
}

export function getItems<T>({
    data,
    getId,
    openItemsByDefault,
    getChildren,
    openItems,
}: {
    data: T;
    getChildren: (t: T) => T[];
    getId: (t: T) => string;
    openItems: string[];
    openItemsByDefault: false;
}): T[] {
    const id = getId(data);
    if (!openItems.includes(id)) {
        return [data];
    }
    return [
        data,
        ...getChildren(data).flatMap((item) =>
            getItems({
                data: item,
                getId,
                openItemsByDefault,
                getChildren,
                openItems,
            })
        ),
    ];
}
