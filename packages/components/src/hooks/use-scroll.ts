import React, { useEffect } from 'react';
import { useDelayedUpdate } from './use-delayed-update';

/** if ref is not supplied use scroll will return the window scroll */
export const useScroll = ({
    isHorizontal,
    ref,
    disabled = false,
}: {
    isHorizontal?: boolean;
    disabled?: boolean;
    ref?: React.RefObject<HTMLElement>;
}): number => {
    const trigger = useDelayedUpdate();

    useEffect(() => {
        if (!disabled) {
            const target = ref ? ref.current : typeof window !== 'undefined' ? window : undefined;
            target?.addEventListener('scroll', trigger);

            return () => target?.removeEventListener('scroll', trigger);
        } else {
            return;
        }
    }, [disabled, ref, trigger]);

    if (!ref?.current) {
        return isHorizontal ? window.scrollX : window.scrollY;
    }
    return (isHorizontal ? ref.current.scrollLeft : ref.current.scrollTop) || 0;
};
