import type React from 'react';
import { useLayoutEffect } from 'react';
import { useDelayedUpdate } from './use-delayed-update';

/** if ref is not supplied use scroll will return the window scroll */
export const useScroll = (isHorizontal?: boolean, ref?: React.RefObject<HTMLElement>) => {
  const trigger = useDelayedUpdate();

  useLayoutEffect(() => {
    const target = ref ? ref.current : typeof window !== 'undefined' ? window : undefined;
    target?.addEventListener('scroll', trigger);
    return () => {
      target?.removeEventListener('scroll', trigger);
    };
  }, [ref, trigger]);
  if (!ref) {
    if (typeof window === 'undefined') {
      return 0;
    }
    return isHorizontal ? window.scrollX : window.scrollY;
  }
  return (isHorizontal ? ref.current?.scrollLeft : ref.current?.scrollTop) || 0;
};
