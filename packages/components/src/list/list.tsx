import React, { useCallback, useRef } from 'react';
import { KeyCodes } from '../keycodes';
import { useIdListener } from '../hooks/use-id-based-event';
import { StateControls, useStateControls } from '../hooks/use-state-controls';
import { useTemporaryStateControls } from '../hooks/use-temporary-state';
import { searchStringContext } from '../searchable-text/searchable-text';

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
export interface ListProps<T, EL = HTMLDivElement> extends React.HTMLAttributes<EL> {
  getId: (t: T) => string;
  items: Array<T>;
  ItemRenderer: React.ComponentType<ListItemProps<T>>;
  rootElementType?: string;
  focusControl: StateControls<string | undefined>;
  selectionControl: StateControls<string | undefined>;
  searchControl: StateControls<string | undefined>;
  ref?: React.RefObject<EL>;
  isHorizontal?: boolean;
  virtualization?: {
    maxFirstRenderItems: number;
    itemSize?: ((t: T) => number) | number;
  };
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
export type List<T, EL = HTMLDivElement> = (props: ListProps<T, EL>) => JSX.Element;
export function List<T, EL = HTMLDivElement>({
  rootElementType = 'div',
  selectionControl,
  focusControl,
  getId,
  ItemRenderer,
  items,
  ref,
  isHorizontal,
  searchControl,
  ...props
}: ListProps<T, EL>): JSX.Element {
  const [selectedId, setSelectedId] = useStateControls(selectionControl);
  const [focusedId, setFocusedId] = useStateControls(focusControl);
  const [searchText, setSearchText] = useTemporaryStateControls(searchControl);
  const defaultRef = useRef<EL>();
  const actualRef = ref || defaultRef;
  const onMouseMove = useIdListener(setFocusedId);
  const onClick = useIdListener(setSelectedId);

  const onKeyPress = useCallback(
    (ev: KeyboardEvent) => {
      const moveToItem = (item: T | undefined) => {
        if (item) {
          setFocusedId(getId(item));
        }
      };
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
  return React.createElement(
    rootElementType,
    { ...props, ref: actualRef, onMouseMove, onClick, onKeyPress },
    <searchStringContext.Provider value={searchText || ''}>
      {items.map((item) => {
        const id = getId(item);
        <ItemRenderer
          key={id}
          id={id}
          data={item}
          focus={setFocusedId}
          isFocused={focusedId === id}
          isSelected={selectedId === id}
          select={setSelectedId}
        />;
      })}
    </searchStringContext.Provider>
  );
}
