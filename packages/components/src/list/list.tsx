import React, { JSX, useCallback, useEffect, useMemo, useRef } from 'react';
import {
    callInternalFirst,
    defaultRoot,
    defineElementSlot,
    mergeObjectInternalWins,
    preferExternal,
} from '../hooks/use-element-slot.js';
import { useIdListener } from '../hooks/use-id-based-event.js';
import { getHandleKeyboardNav } from '../hooks/use-keyboard-nav.js';
import { StateControls, useStateControls } from '../hooks/use-state-controls.js';
import type { UseTransmit } from '../hooks/use-transmitted-events.js';

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

    // Adapted from MDN as it's similar to the AnchorNode functionality in the DOM Selection API
    // https://developer.mozilla.org/en-US/docs/Web/API/Selection/anchorNode
    // A user may make a selection from up to down (in document order) or down to up (reverse of document order).
    // The anchor is where the user began the selection. This can be visualized by holding the Shift key and
    // pressing the arrow keys on your keyboard. The selection's anchor does not move,
    // but the selection's focus, the other end of the selection, does move.
    // Basically, This helps us determine which element is the starting point of the range selection.
    const rangeSelectionAnchorId = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (selectedIds.length === 1) {
            rangeSelectionAnchorId.current = selectedIds[0];
        } else if (selectedIds.length === 0) {
            rangeSelectionAnchorId.current = undefined;
        }
    }, [selectedIds]);

    const { current: indexMap } = useRef(new Map<string, number>());

    const itemsToRender = useMemo(() => {
        indexMap.clear();
        const jsxElements: JSX.Element[] = [];

        for (const [index, item] of items.entries()) {
            const id = getId(item);
            indexMap.set(id, index);

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
                    isSelected={selectedIds.includes(id)}
                    select={setSelectedIds}
                />,
            );
        }

        return jsxElements;
    }, [
        indexMap,
        items,
        getId,
        ItemRenderer,
        onItemMount,
        onItemUnmount,
        setFocusedId,
        focusedId,
        selectedIds,
        setSelectedIds,
    ]);

    const onClick = useIdListener(
        useCallback(
            (id, ev: React.MouseEvent): void => {
                // allowing to clear selection when providing an empty select ids array
                if (!id) {
                    setSelectedIds([]);
                    setFocusedId(undefined);
                    return;
                }

                setFocusedId(id);

                const isAlreadySelected = selectedIds.includes(id);

                if (!enableMultiselect) {
                    if (isAlreadySelected) {
                        return;
                    }

                    setSelectedIds([id]);
                    return;
                }

                const isCtrlPressed = ev.ctrlKey || ev.metaKey;
                const isShiftPressed = ev.shiftKey;

                if (isCtrlPressed && isAlreadySelected) {
                    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
                } else if (isCtrlPressed) {
                    setSelectedIds([...selectedIds, id]);
                } else if (isShiftPressed) {
                    setSelectedIds(
                        getRangeSelection({
                            items,
                            id,
                            indexMap,
                            selectedIds,
                            rangeSelectionAnchorId: rangeSelectionAnchorId.current,
                            getId,
                        }),
                    );
                } else {
                    setSelectedIds([id]);
                }
            },
            [setFocusedId, selectedIds, enableMultiselect, setSelectedIds, items, indexMap, getId],
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

function getRangeSelection<T>({
    id,
    indexMap,
    items,
    selectedIds,
    rangeSelectionAnchorId,
    getId,
}: {
    selectedIds: string[];
    id: string;
    items: T[];
    indexMap: Map<string, number>;
    rangeSelectionAnchorId?: string;
    getId: (item: T) => string;
}) {
    const [first] = selectedIds;

    if (!first) {
        return [id];
    }

    // if the `rangeSelectionAnchorId` is not set, we will consider the
    // first selected item as the starting point of the range selection.
    const firstIndex = indexMap.get(rangeSelectionAnchorId || first);
    const selectedIndex = indexMap.get(id);

    if (firstIndex === undefined || selectedIndex === undefined) {
        return [id];
    }

    const startIndex = Math.min(firstIndex, selectedIndex);
    const endIndex = Math.max(firstIndex, selectedIndex);

    // we add 1 to `endIndex` to include the last item in the selection
    return items.slice(startIndex, endIndex + 1).map(getId);
}
