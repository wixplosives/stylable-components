import type React from 'react';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDelayedUpdateState } from './use-delayed-update';

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
  }, [dim, isVertical, watchSize]);
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
  }, [dim, isVertical, startDim, watchSize]);
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
  }, [element, watchSize]);
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
  }, [element, watchSize]);
  return rect;
};

const noop = () => undefined;
const createSetableObserver = () => {
  let listener: ResizeObserverCallback = noop;
  const listen = (lis: ResizeObserverCallback) => (listener = lis);
  const observer = new ResizeObserver((ev, obs) => listener(ev, obs));
  return {
    listen,
    observer,
  };
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
  // const cache = useRef(new Map<T, WatchedSize>());
  const [sizes, updateSizes] = useState(() => getSizes(ref, data, precomputed, getId, false));
  const delayedUpdateSizes = useDelayedUpdateState(updateSizes);
  const { observer, listen } = useMemo(createSetableObserver, []);
  listen((_entries) => {
    // for(const { target, borderBoxSize} of entries) {
    //   sizes
    //   if (cache.current.has()) {}
    // }
    delayedUpdateSizes(() => getSizes(ref, data, precomputed, getId, true));
  });
  useEffect(() => {
    return () => observer.disconnect();
  }, [observer]);

  useLayoutEffect(() => {
    if (!shouldMeasure || typeof size === 'function') {
      return;
    }
    updateSizes(getSizes(ref, data, precomputed, getId, true));
    if (!ref?.current || shouldWatchSize === false || !observer) {
      return;
    }
    const results = elementsById(ref.current);
    for (const el of Object.values(results)) {
      observer.observe(el);
    }
  }, [data, precomputed, getId, shouldMeasure, size, ref, shouldWatchSize, observer]);
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
