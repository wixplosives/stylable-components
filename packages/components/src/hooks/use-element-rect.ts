import type React from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';

export interface WatchedSize {
  width: null | number;
  height: null | number;
}
const rectToSize = (rect?: DOMRect): WatchedSize => {
  return rect
    ? {
        width: rect.width,
        height: rect.height,
      }
    : {
        width: null,
        height: null,
      };
};

export const useElementSize = (element: React.RefObject<HTMLElement>, watchSize: boolean | WatchedSize) => {
  const startRect = useMemo(() => {
    if (typeof watchSize === 'object') {
      return watchSize;
    }
    return rectToSize(element.current?.getBoundingClientRect());
  }, [element]);
  const [rect, updateRect] = useState(startRect);
  useLayoutEffect(() => {
    let observer: ResizeObserver;
    updateRect(rectToSize(element.current?.getBoundingClientRect()));
    if (typeof watchSize === 'object') {
      return;
    }
    if (watchSize && element.current) {
      observer = new ResizeObserver(() => {
        updateRect(rectToSize(element.current?.getBoundingClientRect()));
      });
      observer.observe(element.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [element.current]);
  return rect;
};
