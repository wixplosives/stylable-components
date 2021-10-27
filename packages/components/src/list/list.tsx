import React, { useRef } from 'react';
import { useIdListener } from '../hooks/use-id-based-event';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import {
    callInternalFirst,
    defaultRoot,
    defineElementSlot,
    mergeObjectInternalWins,
    preferExternal,
} from '../hooks/use-element-slot';
import { useIdBasedKeyboardNav } from '../hooks/use-keyboard-nav';

export type ListRootMinimalProps = Pick<
    React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>,
    'children' | 'onClick' | 'onMouseMove' | 'onKeyPress' | 'ref' | 'onKeyDown' | 'tabIndex'
>;

export const ListRootPropMapping = {
    style: mergeObjectInternalWins,
    onClick: callInternalFirst,
    onmousemove: callInternalFirst,
    onKeyPress: callInternalFirst,
    onKeyDown: callInternalFirst,
    tabIndex: preferExternal,
};
export const {
    slot: listRoot,
    create: createListRoot,
    forward: forwardListRoot,
    parentSlot: listRootParent,
    Slot: RootSlot,
} = defineElementSlot<ListRootMinimalProps>(defaultRoot, ListRootPropMapping);
export interface ListItemProps<T> {
    data: T;
    /***
     * id computed by using ListProps.getId on data
     * id must be placed on the element where mouse events are to be cought as "data-id"
     */
    id: string;
    isFocused: boolean;
    isSelected: boolean;
    focus: (id?: string) => void;
    select: (id?: string) => void;
}
export interface ListProps<T> {
    listRoot?: typeof listRoot;
    getId: (t: T) => string;
    items: Array<T>;
    ItemRenderer: React.ComponentType<ListItemProps<T>>;
    focusControl?: StateControls<string | undefined>;
    selectionControl?: StateControls<string | undefined>;
}

export type List<T> = (props: ListProps<T>) => JSX.Element;

export function List<T, EL extends HTMLElement = HTMLDivElement>({
    listRoot,
    selectionControl,
    focusControl,
    getId,
    ItemRenderer,
    items,
}: ListProps<T>): JSX.Element {
    const [selectedId, setSelectedId] = useStateControls(selectionControl);
    const [focusedId, setFocusedId] = useStateControls(focusControl);
    const defaultRef = useRef<EL>();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actualRef = listRoot?.props?.ref || defaultRef;
    const onMouseMove = useIdListener(setFocusedId);
    const onClick = useIdListener(setSelectedId);
    const onKeyPress = useIdBasedKeyboardNav(focusedId, setFocusedId, selectedId, setSelectedId);
    return (
        <RootSlot
            slot={listRoot}
            props={{
                ref: actualRef as React.RefObject<EL>,
                onMouseMove,
                onClick,
                onKeyPress,
                onKeyDown: onKeyPress,
                tabIndex: 0,
            }}
        >
            {items.map((item) => {
                const id = getId(item);
                return (
                    <ItemRenderer
                        key={id}
                        id={id}
                        data={item}
                        focus={setFocusedId}
                        isFocused={focusedId === id}
                        isSelected={selectedId === id}
                        select={setSelectedId}
                    />
                );
            })}
        </RootSlot>
    );
}
