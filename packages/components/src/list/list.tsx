import React, { useCallback, useRef } from 'react';
import { KeyCodes } from '../keycodes';
import { useIdListener } from '../hooks/use-id-based-event';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { searchStringContext } from '../searchable-text/searchable-text';
import { callInternalFirst, createElementSlot, defaultRoot, mergeObjectInternalWins } from '../hooks/use-element-slot';
import { ElementSlot, elementSlot } from '../common/types';

export type ListRootMinimalProps = Pick<
  React.DOMAttributes<HTMLElement> & React.RefAttributes<HTMLElement>,
  'children' | 'onClick' | 'onMouseMove' | 'onKeyPress' | 'ref'
>;
export const ListRootPropMapping = {
  style: mergeObjectInternalWins,
  onClick: callInternalFirst,
  onmousemove: callInternalFirst,
  onKeyPress: callInternalFirst,
};
export const createListRoot = elementSlot<ListRootMinimalProps, typeof ListRootPropMapping>();

const useListRootElement = createElementSlot<ListRootMinimalProps>(defaultRoot, ListRootPropMapping);

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
  root?: ElementSlot<ListRootMinimalProps>;
  getId: (t: T) => string;
  items: Array<T>;
  ItemRenderer: React.ComponentType<ListItemProps<T>>;
  focusControl?: StateControls<string | undefined>;
  selectionControl?: StateControls<string | undefined>;
  searchControl?: StateControls<string | undefined>;
  isHorizontal?: boolean;
}

function itemIndex<T>(getId: (t: T) => string, items: Array<T>, currentId?: string) {
  return items.findIndex((i) => getId(i) === currentId);
}

function nextItem<T>(getId: (t: T) => string, items: Array<T>, currentId?: string) {
  const idx = itemIndex(getId, items, currentId);
  if (idx === -1) {
    return undefined;
  }
  return items[idx + 1];
}

function prevItem<T>(getId: (t: T) => string, items: Array<T>, currentId?: string) {
  const idx = itemIndex(getId, items, currentId);

  return items[idx - 1];
}

export type List<T> = (props: ListProps<T>) => JSX.Element;

export function List<T, EL extends HTMLElement = HTMLDivElement>({
  root,
  selectionControl,
  focusControl,
  getId,
  ItemRenderer,
  items,
  isHorizontal,
  searchControl,
}: ListProps<T>): JSX.Element {
  const [selectedId, setSelectedId] = useStateControls(selectionControl);
  const [focusedId, setFocusedId] = useStateControls(focusControl);
  const [searchText, setSearchText] = useStateControls(searchControl);
  const defaultRef = useRef<EL>();
  const actualRef = root?.props.ref || defaultRef;
  const onMouseMove = useIdListener(setFocusedId);
  const onClick = useIdListener(setSelectedId);

  const onKeyPress = useCallback(
    (ev: React.KeyboardEvent) => {
      const moveToItem = (item: T | undefined) => {
        if (item) {
          setFocusedId(getId(item));
        }
      };
      console.log(ev.code);
      switch (ev.code) {
        case KeyCodes.ArrowLeft:
          if (isHorizontal) {
            const prev = prevItem(getId, items, focusedId);
            moveToItem(prev);
          }
          break;
        case KeyCodes.ArrowRight:
          if (isHorizontal) {
            const next = nextItem(getId, items, focusedId);
            moveToItem(next);
          }
          break;
        case KeyCodes.ArrowUp:
          if (!isHorizontal) {
            const prev = prevItem(getId, items, focusedId);
            moveToItem(prev);
          }
          break;
        case KeyCodes.ArrowDown:
          if (isHorizontal) {
            const next = nextItem(getId, items, focusedId);
            moveToItem(next);
          }
          break;
        case KeyCodes.Space:
        case KeyCodes.Enter:
          setSelectedId(focusedId);
          break;
        default:
          if (ev.key) {
            setSearchText(searchText || '' + ev.key);
          }
      }
    },
    [focusedId, getId, isHorizontal, items, searchText, setFocusedId, setSearchText, setSelectedId]
  );
  return useListRootElement(
    root,
    {
      ref: actualRef as React.RefObject<EL>,
      onMouseMove,
      onClick,
      onKeyPress,
    },
    <searchStringContext.Provider value={searchText || ''}>
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
    </searchStringContext.Provider>
  );
}
