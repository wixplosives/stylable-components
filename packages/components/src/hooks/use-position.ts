/* eslint-disable @typescript-eslint/no-unsafe-call */
import type React from 'react';
import { useLayoutEffect, useState, useRef, useCallback } from 'react';
import { waitForRef } from './hook-utils';
import { unchanged, useDelayedUpdateState } from './use-delayed-update';

export const defaultPos = { x: null, y: null };
export interface Pos {
    x: number | null;
    y: number | null;
}

const getItemPosition = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();
    return {
        x: box.top,
        y: box.left,
    };
};

const getItemPositionInParent = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();
    const parentBox = el.parentElement!.getBoundingClientRect();
    return {
        y: box.top - parentBox.top,
        x: box.left - parentBox.left,
    };
};

const isSamePos = (p1: Pos, p2: Pos) => p1.x === p2.x && p1.y === p2.y;

type Watch = 'measure-once' | 'timer' | 'ignore';
export const usePosition = (element: React.RefObject<HTMLElement>, watchPosition: Pos | boolean = false): Pos => {
    const watch: Watch = typeof watchPosition === 'object' ? 'ignore' : watchPosition ? 'timer' : 'measure-once';
    const lastValRef = useRef<Pos>();
    const onTimer = useCallback((el: HTMLElement) => {
        const res = getItemPosition(el);
        if (lastValRef.current && isSamePos(res, lastValRef.current)) {
            return unchanged;
        }
        lastValRef.current = res;
        return res;
    }, []);
    return useAfterRenderEffect(element, onTimer, watch, defaultPos);
};
export const usePositionInParent = (
    element: React.RefObject<HTMLElement>,
    watchPosition: Pos | boolean = false
): Pos => {
    const watch: Watch = typeof watchPosition === 'object' ? 'ignore' : watchPosition ? 'timer' : 'measure-once';
    const lastValRef = useRef<Pos>();
    const onTimer = useCallback((el: HTMLElement) => {
        const res = getItemPositionInParent(el);
        if (lastValRef.current && isSamePos(res, lastValRef.current)) {
            return unchanged;
        }
        lastValRef.current = res;
        return res;
    }, []);
    return useAfterRenderEffect(element, onTimer, watch, defaultPos);
};

export const useAfterRenderEffect = <T, U = null>(
    element: React.RefObject<HTMLElement>,
    onElementUpdate: (el: HTMLElement) => T | typeof unchanged,
    watch?: Watch,
    def: T | U = null as unknown as U
): T | U => {
    const [state, update] = useState(def);
    const delayedUpdate = useDelayedUpdateState(update);
    useLayoutEffect(() => {
        if (watch === 'ignore') {
            return;
        }

        const onElement = () => {
            const delayedUpdateListener = () => {
                const value = onElementUpdate(element.current!);

                return value;
            };
            delayedUpdate(delayedUpdateListener);
            return () => {
                //
            };
        };
        if (element.current) {
            return onElement();
        }
        return waitForRef(element, onElement);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [delayedUpdate, element, onElementUpdate, watch, {}]);
    return state;
};
