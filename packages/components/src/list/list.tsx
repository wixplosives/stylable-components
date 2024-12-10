import React, { useCallback, useEffect, useRef, useState } from 'react';
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

export type List<T> = (props: ListProps<T>) => JSX.Element;

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
}: ListProps<T>): JSX.Element {
    const [selectedIds, setSelectedIds] = useStateControls(selectionControl, []);
    const [focusedId, setFocusedId] = useStateControls(focusControl, undefined);
    const [prevSelectedId, setPrevSelectedId] = useState(selectedIds);
    if (selectedIds !== prevSelectedId) {
        setFocusedId(selectedIds[selectedIds.length - 1]);
        setPrevSelectedId(selectedIds);
    }
    const defaultRef = useRef<EL>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actualRef = listRoot?.props?.ref || defaultRef;

    const onClick = useIdListener(
        useCallback(
            (id: string | undefined, ev: React.MouseEvent<Element, MouseEvent>): void => {
                if (!id) {
                    setSelectedIds([]);
                    return;
                }

                const isSameSelected = selectedIds.includes(id);

                if (!enableMultiselect) {
                    if (isSameSelected) {
                        return;
                    }

                    setSelectedIds([id]);
                    return;
                }

                const isCtrlPressed = ev.ctrlKey || ev.metaKey;

                if (isSameSelected && isCtrlPressed) {
                    setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
                    return;
                }

                if (isCtrlPressed) {
                    setSelectedIds([...selectedIds, id]);
                } else {
                    setSelectedIds([id]);
                }
            },
            [enableMultiselect, selectedIds, setSelectedIds],
        ),
    );

    const onKeyPress = disableKeyboard
        ? () => {}
        : getHandleKeyboardNav(actualRef as React.RefObject<HTMLElement>, focusedId, setFocusedId, setSelectedIds);
    if (transmitKeyPress) {
        transmitKeyPress(callInternalFirst(onKeyPress, listRoot?.props?.onKeyPress));
    }
    return (
        <ListRootSlot
            slot={listRoot}
            props={{
                ref: actualRef as React.RefObject<HTMLDivElement>,
                onClick,
                onKeyPress,
                onKeyDown: onKeyPress,
                tabIndex: 0,
            }}
        >
            {items.map((item) => {
                const id = getId(item);
                return (
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
                    />
                );
            })}
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
