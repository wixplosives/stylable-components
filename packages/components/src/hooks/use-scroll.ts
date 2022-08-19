import { useLayoutEffect } from 'react';
import { waitForRef } from './hook-utils';
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

    useLayoutEffect(() => {
        if (!disabled) {
            const listen = () => {
                const target = ref ? ref.current : typeof window !== 'undefined' ? window : undefined;
                target?.addEventListener('scroll', trigger);
                return () => target?.removeEventListener('scroll', trigger);
            };
            if (ref && !ref.current) {
                return waitForRef(ref, listen);
            }
            return listen();
        }
        return;
    }, [disabled, ref, trigger]);

    if (!ref?.current) {
        if (typeof window === 'undefined') {
            return 0;
        }
        return isHorizontal ? window.scrollX : window.scrollY;
    }
    return (isHorizontal ? ref.current.scrollLeft : ref.current.scrollTop) || 0;
};
