import type React from 'react';

export const waitForRef = <T, U extends () => void>(element: React.RefObject<T | null>, cb: () => U) => {
    if (element.current) {
        return cb();
    } else {
        // in many cases the effect that is supposed to update the ref does not happen.
        // for this cases, we try again after an animation frame
        let cleanUp: U | undefined = undefined;
        const listener = () => {
            if (element.current) {
                cleanUp = cb();
            }
        };
        const animFrame = window.requestAnimationFrame(listener);
        return () => {
            window.cancelAnimationFrame(animFrame);
            return cleanUp?.();
        };
    }
};
