import type React from 'react';
import { useLayoutEffect, useMemo, useState } from 'react';

export interface WatchedSize {
  width: null | number;
  height: null | number;
}
export interface SizesById {
  [id: string]: WatchedSize;
}

const elementOrWindowSize = (dim?: React.RefObject<HTMLElement>): WatchedSize => {
  if (dim) {
    if (dim.current) {
      return rectToSize(dim?.current?.getBoundingClientRect());
    }
    return unMeasured;
  }
  if (typeof window === 'undefined') {
    return unMeasured;
  }
  return {
    height: window.innerHeight,
    width: window.innerWidth,
  };
};

export const useElementDimension = (
  dim?: React.RefObject<HTMLElement>,
  isVertical = true,
  watchSize: number | boolean = false
) => {
  const startDim = useMemo(() => {
    if (typeof watchSize === 'number') {
      return watchSize;
    }
    return watchedSizeToDim(isVertical, elementOrWindowSize(dim));
  }, [dim]);
  const [dimension, updateDimension] = useState(startDim);
  useLayoutEffect(() => {
    let observer: ResizeObserver;
    if (typeof watchSize === 'number') {
      return;
    }
    updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize(dim)));
    if (dim?.current && watchSize) {
      observer = new ResizeObserver(() => {
        updateDimension(watchedSizeToDim(isVertical, elementOrWindowSize(dim)));
      });
      observer.observe(dim.current);
      return () => {
        observer.disconnect();
      };
    }
    return undefined;
  }, [startDim]);
  return dimension;
};

const watchedSizeToDim = (isVertical: boolean, size: WatchedSize): number => {
  return (isVertical ? size.height : size.width) || 0;
};

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
const elementToSize = (element?: Element): WatchedSize => {
  const rect = element?.getBoundingClientRect();
  return rectToSize(rect);
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

export function useIdBasedRects<T, EL extends HTMLElement>(
  ref: React.RefObject<EL>,
  data: T[],
  getId: (t: T) => string,
  size: WatchedSize | ((t: T) => WatchedSize) | boolean
): SizesById {
  const shouldMeasure = typeof size === 'boolean';
  const shouldWatchSize = size === true;
  const precomputed = typeof size === 'boolean' ? undefined : size;
  const emptySizes = useMemo(() => getSizes(ref, data, precomputed, getId, false), []);
  const [sizes, updateSizes] = useState(emptySizes);
  useLayoutEffect(() => {
    let observer: MutationObserver;
    if (!shouldMeasure || typeof size === 'function') {
      return;
    }
    updateSizes(getSizes(ref, data, precomputed, getId, true));
    if (!ref?.current || shouldWatchSize === false) {
      return;
    }
    observer = new MutationObserver(() => {
      updateSizes(getSizes(ref, data, precomputed, getId, true));
    });
    observer.observe(ref.current, {
      attributes: true,
      childList: true,
    });
    return () => {
      observer.disconnect();
    };
  }, [ref.current, data, precomputed, getId]);
  return sizes;
}

export const unMeasured: WatchedSize = {
  width: null,
  height: null,
};
export function getSizes<T, EL extends HTMLElement>(
  ref: React.RefObject<EL>,
  data: T[],
  size: WatchedSize | ((t: T) => WatchedSize) | undefined,
  getId: (t: T) => string,
  meassure: boolean
) {
  if (typeof size === 'function') {
    return data.reduce((acc, item) => {
      acc[getId(item)] = size(item);
      return acc;
    }, {} as SizesById);
  }
  if (typeof size !== 'undefined') {
    return data.reduce((acc, item) => {
      acc[getId(item)] = size;
      return acc;
    }, {} as SizesById);
  }
  if (!meassure || !ref.current) {
    return data.reduce((acc, item) => {
      acc[getId(item)] = unMeasured;
      return acc;
    }, {} as SizesById);
  }
  const elements = elementsById(ref.current);
  return data.reduce((acc, item) => {
    const id = getId(item);
    const element = elements[id];
    if (element) {
      acc[getId(item)] = elementToSize(element);
    } else {
      acc[getId(item)] = unMeasured;
    }
    return acc;
  }, {} as SizesById);
}

export function elementsById(scope: Element) {
  const results = scope.querySelectorAll('[data-id]');
  const res: Record<string, Element> = {};
  results.forEach((el) => {
    const id = el.getAttribute('data-id')!;
    res[id] = el;
  });
  return res;
}
