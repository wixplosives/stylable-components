/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useCallback, useEffect, useRef } from 'react';

export function useTransmittedCB<CB extends (...args: any[]) => any>() {
    const cbs = useRef(new Set<CB>()).current;
    const cb = useCallback(
        (...args: Parameters<CB>): ReturnType<CB> => {
            let val: any = undefined;
            for (const cb of cbs) {
                val = cb(...args);
            }
            return val;
        },
        [cbs]
    );
    function useTransmit(cb: CB) {
        cbs.add(cb);
        useEffect(() => {
            return () => {
                cbs.delete(cb);
            };
        }, [cb]);
    }
    return { cb, useTransmit };
}

export type UseTransmit<CB extends (...args: any[]) => any> = (cb: CB) => void;
