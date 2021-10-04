import React, { useMemo } from 'react';
import type { ListProps } from '../list/list';

export interface VirtualizationOptions<T> {
  maxFirstRenderSize: number;
  itemSize: ((t: T) => number) | number;
}

export interface ScrollListProps<T> extends ListProps<T>{

}

export function ScrollList<T>({
  data,
  isHorizontal,
  listSize,
  options,
  ref,
  renderer,
}: {
  ref: React.RefObject<HTMLElement>;
  isHorizontal: boolean;
  listSize: number;
  data: T[];
  renderer: (t: T) => JSX.Element;
  options: VirtualizationOptions<unknown>;
}): JSX.Element {
  const currentScroll = isHorizontal ? ref.current?.scrollLeft : ref.current?.scrollTop;
  const maxScrollSize = data.reduce((acc, current) => {
    return acc + (typeof options.itemSize === 'number' ? options.itemSize : options.itemSize(current));
  }, 0);
  const style: React.CSSProperties = {
    position: 'relative',
  };
  if (isHorizontal) {
    style.width = maxScrollSize + 'px';
  } else {
    style.height = maxScrollSize + 'px';
  }

  const firstRender = useMemo(
    () => data.slice(0, options.maxFirstRenderSize).map(renderer),
    [data, options.maxFirstRenderSize]
  );

  let filledSize = 0;
  let itemIdx = 0;
  let nonRenderedItemsSize = 0;
  const res: JSX.Element[] = [];

  if (currentScroll !== undefined) {
    for (let i = 0; i < data.length; i++) {
      const item = data[itemIdx]!;
      if (filledSize > currentScroll - listSize / 2) {
        res.push(renderer(item));
      } else {
        nonRenderedItemsSize += typeof options.itemSize === 'number' ? options.itemSize : options.itemSize(item);
      }
      filledSize += typeof options.itemSize === 'number' ? options.itemSize : options.itemSize(item);
      if (filledSize > currentScroll + listSize * 1.5) {
        break;
      }
    }
    while (data[itemIdx] && filledSize < currentScroll + listSize * 1.5) {
      const item = data[itemIdx]!;
      itemIdx++;
      filledSize += typeof options.itemSize === 'number' ? options.itemSize : options.itemSize(item);
      if (filledSize > currentScroll - listSize / 2) {
        res.push(renderer(item));
      }
    }
  }
  const innerStyle: React.CSSProperties = {
    position: 'absolute',
  };
  if (isHorizontal) {
    innerStyle.top = '0px';
    innerStyle.left = nonRenderedItemsSize + 'px';
  } else {
    innerStyle.left = '0px';
    innerStyle.top = nonRenderedItemsSize + 'px';
  }

  return (
    <div style={style}>
      <div style={innerStyle}>{firstRender}</div>
    </div>
  );
}
