import React, { JSX, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    callInternalFirst,
    defaultRoot,
    defineElementSlot,
    mergeObjectInternalWins,
    preferExternal,
} from '../hooks/use-element-slot';
import { useIdListener } from '../hooks/use-id-based-event';
import { getHandleKeyboardNav } from '../hooks/use-keyboard-nav';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import type { UseTransmit } from '../hooks/use-transmitted-events';

export type ListRootMinimalProps = Pick<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>,
    'children' | 'onClick' | 'onMouseMove' | 'onKeyPress' | 'ref' | 'onKeyDown' | 'tabIndex'
>;

export const ListRootPropMapping = {
    style: mergeObjectInternalWins,
    onClick: callInternalFirst,
    onmousemove: callInternalFirst,
    onKeyPress: callInternalFirst,
    onKeyDown: callInternalFirst,
    tabIndex: preferExternal,
    ref: preferExternal,
};
export const {
    slot: listRoot,
    create: createListRoot,
    parentSlot: listRootParent,
    Slot: ListRootSlot,
} = defineElementSlot<ListRootMinimalProps>(defaultRoot, ListRootPropMapping);

export interface ListItemProps<T> {
    data: T;
    /***
     * id computed by using ListProps.getId on data
     * id must be placed on the element where mouse events are to be caught as "data-id"
     */
    id: string;
    isFocused: boolean;
    isSelected: boolean;
    focus: (id?: string) => void;
    select: (ids: string[]) => void;
}

export interface ListProps<T> {
    listRoot?: typeof listRoot;
    getId: (item: T) => string;
    items: T[];
    ItemRenderer: React.ComponentType<ListItemProps<T>>;
    focusControl?: StateControls<string | undefined>;
    selectionControl?: StateControls<string[]>;
    transmitKeyPress?: UseTransmit<React.KeyboardEventHandler>;
    onItemMount?: (item: T) => void;
    onItemUnmount?: (item: T) => void;
    disableKeyboard?: boolean;
    enableMultiselect?: boolean;
}

export type List<T> = (props: ListProps<T>) => React.ReactElement;

export function List<T, EL extends HTMLElement = HTMLDivElement>({
    listRoot,
    selectionControl,
    focusControl,
    getId,
    ItemRenderer,
    items,
    transmitKeyPress,
    onItemMount,
    onItemUnmount,
    disableKeyboard,
    enableMultiselect = true,
}: ListProps<T>): React.ReactElement {
    const [selectedIds, setSelectedIds] = useStateControls(selectionControl, []);
    const [focusedId, setFocusedId] = useStateControls(focusControl, undefined);
    const defaultRef = useRef<EL>(null);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actualRef = listRoot?.props?.ref || defaultRef;

    const indexMap = useRef(new Map<string, number>());

    const itemsToRender = useMemo(() => {
        indexMap.current.clear();
        const jsxElements: JSX.Element[] = [];

        for (const [index, item] of items.entries()) {
            const id = getId(item);
            indexMap.current.set(id, index);

            jsxElements.push(
                <ItemRendererWrapped
                    ItemRenderer={ItemRenderer}
                    onMount={onItemMount}
                    onUnmount={onItemUnmount}
                    key={id}
                    id={id}
                    data={item}
                    focus={setFocusedId}
                    isFocused={focusedId === id}
                    isSelected={selectedIds.findIndex((selectedId) => selectedId === id) !== -1}
                    select={setSelectedIds}
                />,
            );
        }

        return jsxElements;
    }, [ItemRenderer, focusedId, getId, items, onItemMount, onItemUnmount, selectedIds, setFocusedId, setSelectedIds]);

    const rangeSelectionAnchor = useRef<string | undefined>(focusedId);

    const onClick = useIdListener(
        useCallback(
            (id: string | undefined, ev: React.MouseEvent<Element, MouseEvent>): void => {
                // allowing to clear selection when providing an empty select ids array
                if (!id) {
                    setSelectedIds([]);
                    setFocusedId(undefined);
                    return;
                }

                if (!ev.shiftKey) {
                    // Given a focused item, if the user clicks on an item while holding shift,
                    // the range selection will start from the first-focused item, and consider it as the starting point
                    // for other selection made while holding shift.

                    // Consider the following steps for the following example:
                    // - item 1
                    // - item 2
                    // - item 3
                    // - item 4
                    // - item 5

                    // 1. focus on item 2 <- this selects item 2 and sets it as the rangeSelectionAnchor
                    // 2. click on item 4 while holding shift
                    // the expected behavior is to select items 2, 3, and 4
                    // 3. now click on item 1 while holding shift
                    // the expected behavior is to select items 1 and 2, instead of 1, 2, 3, and 4
                    // since item 2 is the anchored item.

                    rangeSelectionAnchor.current = id;
                }

                setFocusedId(id);

                const isSameSelected = selectedIds.includes(id);

                if (!enableMultiselect) {
                    if (isSameSelected) {
                        return;
                    }

                    setSelectedIds([id]);
                    return;
                }

                const isCtrlPressed = ev.ctrlKey || ev.metaKey;
                const isShiftPressed = ev.shiftKey;

                if (isSameSelected && isCtrlPressed) {
                    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
                    return;
                }

                if (isCtrlPressed) {
                    setSelectedIds([...selectedIds, id]);
                } else if (isShiftPressed) {
                    const [first] = selectedIds;

                    if (!first) {
                        setSelectedIds([id]);
                        return;
                    }

                    // if the `rangeSelectionAnchor` is not set, we will consider the first selected item as the
                    // starting point of the range selection.
                    const firstIndex = indexMap.current.get(rangeSelectionAnchor.current || first);
                    const selectedIndex = indexMap.current.get(id);

                    if (firstIndex === undefined || selectedIndex === undefined) {
                        setSelectedIds([id]);
                        return;
                    }

                    const startIndex = Math.min(firstIndex, selectedIndex);
                    const endIndex = Math.max(firstIndex, selectedIndex);

                    // we add 1 to the endIndex to include the last item in the selection
                    setSelectedIds(items.slice(startIndex, endIndex + 1).map(getId));
                } else {
                    setSelectedIds([id]);
                }
            },
            [enableMultiselect, getId, items, selectedIds, setFocusedId, setSelectedIds],
        ),
    );

    const onKeyPress = disableKeyboard
        ? () => {}
        : getHandleKeyboardNav(
              actualRef as React.RefObject<HTMLElement | null>,
              focusedId,
              setFocusedId,
              setSelectedIds,
          );
    if (transmitKeyPress) {
        transmitKeyPress(callInternalFirst(onKeyPress, listRoot?.props?.onKeyPress));
    }
    return (
        <ListRootSlot
            slot={listRoot}
            props={{
                ref: actualRef as React.RefObject<HTMLDivElement | null>,
                onClick,
                onKeyPress,
                onKeyDown: onKeyPress,
                tabIndex: 0,
            }}
        >
            {itemsToRender}
        </ListRootSlot>
    );
}

interface ItemRendererWrappedProps<T> {
    onMount?: (item: T) => void;
    onUnmount?: (item: T) => void;
    ItemRenderer: React.ComponentType<ListItemProps<T>>;
}

function ItemRendererWrapped<T>({
    ItemRenderer,
    onMount,
    onUnmount,
    ...props
}: ListItemProps<T> & ItemRendererWrappedProps<T>) {
    useEffect(() => {
        onMount?.(props.data);

        return () => onUnmount?.(props.data);
    }, [onMount, onUnmount, props.data]);

    return <ItemRenderer {...props} />;
}
