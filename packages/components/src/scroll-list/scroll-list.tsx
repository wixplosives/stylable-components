import React, { useLayoutEffect, useMemo, useRef } from 'react';
import { elementSlot, ElementSlot, PropMapping } from '../common/types';
import { useElementDimension, useIdBasedRects, WatchedSize } from '../hooks/use-element-rect';
import { classes } from '../preloader/variants/circle-preloader.st.css';
import {
  createElementSlot,
  defaultRoot,
  mergeObjectExternalWins,
  mergeObjectInternalWins,
  useForwardElementSlot,
} from '../hooks/use-element-slot';
import { useScroll } from '../hooks/use-scroll';
import { List, ListProps, ListRootMinimalProps } from '../list/list';
import { Preloader } from '../preloader/preloader';

const defaultPreloader: ElementSlot<{}> = {
  el: Preloader,
  props: {
    className: classes.root,
  },
};
export type ScrollListRootMinimalProps = Pick<
  React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>,
  'children' | 'style' | 'ref'
>;
export const ScrollListRootPropMapping: PropMapping<ScrollListRootMinimalProps> = {
  style: mergeObjectInternalWins,
};
export const createListRoot = elementSlot<ScrollListRootMinimalProps, typeof ScrollListRootPropMapping>();

const useScrollListRootElement = createElementSlot<ScrollListRootMinimalProps>(defaultRoot, ScrollListRootPropMapping);

const useScrollListPreloaderElement = createElementSlot<{}>(defaultPreloader);

export interface ScrollListProps<T, EL extends HTMLElement> extends ListProps<T> {
  /**
   * element to watch for scroll and size updates, if omitted will use the window
   */
  scrollWindow?: React.RefObject<EL>;
  /*
   *   false: no remeasure,
   *   true: measure on changes,
   *   number: use the number as size
   */
  watchScrollWindoSize?: number | boolean;
  /**
   * Scroll offset for initial render.
   *
   * For vertical lists, this affects scrollTop. For horizontal lists, this affects scrollLeft.
   */
  initialScrollOffset?: number | undefined;
  /**
   * if provided the list will request more items when reaching the scroll length and show the preloader
   */
  loadMore?: (count: number) => void;

  /**
   * Total number of items in the list. Note that only a few items will be rendered and displayed at a time.
   * -1 implies the list is infinite.
   * undefined implies it is the same length as the data
   */
  itemCount?: number;
  /**
   * size of the item ( height if vertical ) in pixels or a method to compute according to data
   * if omitted, item size will be measured
   */
  itemSize?: number | ((t: T) => number) | boolean;
  /**
   * size of the item ( height if vertical ) in pixels
   * @default 50
   * used if item size is not fixed
   */
  estimatedItemSize?: number;
  /**
   * size to render after scroll window size
   * 0.5 means prendering the half the scroll window size
   * @default 0.5
   */
  extraRenderedItems?: number;
  /**
   * if set to false. items will not be unmounted when out of scroll
   * @default true
   */
  unmountItems?: boolean;

  preloader?: ElementSlot<{}>;
}
interface PropsWithStyle {
  style: React.CSSProperties;
}
const rootMergeMap: PropMapping<PropsWithStyle> = {
  style: mergeObjectExternalWins,
};
export type ScrollList<T, EL extends HTMLElement = HTMLDivElement> = (props: ScrollListProps<T, EL>) => JSX.Element;
export function ScrollList<T, EL extends HTMLElement = HTMLDivElement>({
  items,
  isHorizontal = false,
  scrollWindow,
  watchScrollWindoSize,
  itemCount,
  getId,
  ItemRenderer,
  estimatedItemSize = 50,
  focusControl,
  loadMore,
  initialScrollOffset = 0,
  itemSize = false,
  root,
  searchControl,
  selectionControl,
  extraRenderedItems = 0.5,
  // unmountItems,
  preloader,
}: ScrollListProps<T, EL>): JSX.Element {
  const listRef = useRef<HTMLElement>(null);
  const scrollWindowSize = useElementDimension(scrollWindow, !isHorizontal, watchScrollWindoSize);
  const currentScroll = useScroll(isHorizontal, scrollWindow);

  const itemCountForCalc = itemCount === undefined ? items.length : itemCount === -1 ? items.length + 5000 : itemCount;
  const rectOptions = dimToSize(itemSize);
  const sizes = useIdBasedRects(listRef, items, getId, rectOptions);
  const { totalMeasured, totalSize } = items.reduce(
    (acc, current) => {
      const id = getId(current);
      const itemSize = isHorizontal ? sizes[id]?.width : sizes[id]?.height;
      if (itemSize) {
        acc.totalMeasured++;
        acc.totalSize += itemSize;
      }
      return acc;
    },
    {
      totalSize: 0,
      totalMeasured: 0,
    }
  );
  const avgSize = totalMeasured > 0 ? totalSize / totalMeasured : estimatedItemSize;
  const renderEndIndex = Math.ceil(
    (scrollWindowSize * (1 + extraRenderedItems) + currentScroll - initialScrollOffset) / avgSize
  );

  const maxScrollSize = avgSize * itemCountForCalc + initialScrollOffset;
  const style: React.CSSProperties = {
    position: 'relative',
  };
  if (isHorizontal) {
    style.minWidth = maxScrollSize + 'px';
  } else {
    style.minHeight = maxScrollSize + 'px';
  }
  const calledLoadMore = useMemo(() => {
    return {
      value: false,
    };
  }, [items]);

  useLayoutEffect(() => {
    if (!calledLoadMore.value && renderEndIndex > items.length && loadMore) {
      loadMore(items.length - renderEndIndex + scrollWindowSize / avgSize);
      calledLoadMore.value = true;
    }
  }, [calledLoadMore, items]);

  const rendereredItems = useMemo(() => items.slice(0, renderEndIndex), [items, renderEndIndex]);

  const innerStyle: React.CSSProperties = {
    position: 'absolute',
  };
  if (isHorizontal) {
    innerStyle.top = '0px';
    innerStyle.left = '0px';
  } else {
    innerStyle.left = '0px';
    innerStyle.top = '0px';
  }
  const listRootWithStyle = useForwardElementSlot(
    defaultRoot as any as ElementSlot<ListRootMinimalProps>,
    root,
    { style: innerStyle, ref: listRef },
    rootMergeMap
  );
  return useScrollListRootElement(root, { style }, [
    <List<T, EL>
      isHorizontal={isHorizontal}
      getId={getId}
      ItemRenderer={ItemRenderer}
      root={listRootWithStyle}
      items={rendereredItems}
      focusControl={focusControl}
      searchControl={searchControl}
      selectionControl={selectionControl}
    />,
    <div
      style={{
        position: 'relative',
        top: maxScrollSize + 'px',
      }}
    >
      {useScrollListPreloaderElement(preloader, {})}
    </div>,
  ]);
}

export function dimToSize<T>(
  itemSize: number | ((t: T) => number) | boolean
): boolean | WatchedSize | ((t: T) => WatchedSize) {
  if (typeof itemSize === 'boolean') {
    return itemSize;
  }
  if (typeof itemSize === 'number') {
    return {
      width: itemSize,
      height: itemSize,
    };
  }

  return (t: T) => {
    const dim = itemSize(t);
    return {
      width: dim,
      height: dim,
    };
  };
}
