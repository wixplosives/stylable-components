import type React from 'react';
import { useMemo } from 'react';

export interface VirtualizationOptions<T> {
  maxFirstRenderSize: number;
  itemSize?: ((t: T) => number) | number;
}

export const useVirtualCursor = (
  ref: React.RefObject<HTMLElement>,
  isHorizontal: boolean,
  options?: VirtualizationOptions<unknown>
) => {
  const size
  const empty = useMemo(()=>({
    cursor: 0,
    length: options?.maxFirstRenderSize || 50
  }), [options?.maxFirstRenderSize]);


  if(!ref.current){
    return empty
  }

};
