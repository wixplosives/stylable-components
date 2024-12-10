import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { unknownPosition, Position } from '../common';
import { unchanged, useDelayedUpdateState } from './use-delayed-update';

type Watch = 'measure-once' | 'timer' | 'ignore';

const getItemPositionInParent = (el: HTMLElement) => {
    const box = el.getBoundingClientRect();
    const parentBox = el.parentElement!.getBoundingClientRect();
    return {
        y: box.top - parentBox.top,
        x: box.left - parentBox.left,
    };
};

const isSamePosition = (p1: Position, p2: Position) => p1.x === p2.x && p1.y === p2.y;

const useAfterRenderEffect = <T, U = null>(
    element: React.RefObject<HTMLElement | null>,
    onElementUpdate: (el: HTMLElement) => T | typeof unchanged,
    watch?: Watch,
    def: T | U = null as unknown as U,
): T | U => {
    const [state, update] = useState(def);
    const delayedUpdate = useDelayedUpdateState(update);

    useEffect(() => {
        if (watch === 'ignore') {
            return;
        }

        if (element.current) {
            delayedUpdate(() => onElementUpdate(element.current!));
        }
    });

    return state;
};

export const usePositionInParent = (
    element: React.RefObject<HTMLElement | null>,
    watchPosition: Position | boolean = false,
): Position => {
    const watch: Watch = typeof watchPosition === 'object' ? 'ignore' : watchPosition ? 'timer' : 'measure-once';
    const lastValRef = useRef<Position>(undefined);
    const onTimer = useCallback((el: HTMLElement) => {
        if (!el || !el.parentElement) {
            return unchanged;
        }
        const res = getItemPositionInParent(el);
        if (lastValRef.current && isSamePosition(res, lastValRef.current)) {
            return unchanged;
        }
        lastValRef.current = res;
        return res;
    }, []);

    return useAfterRenderEffect(element, onTimer, watch, unknownPosition);
};
