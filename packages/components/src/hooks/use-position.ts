/* eslint-disable @typescript-eslint/no-unsafe-call */
import type React from 'react';
import { useLayoutEffect, useState } from 'react';
import { waitForRef } from './hook-utils';

export const defaultPos = { x: null, y: null };
export interface Pos {
    x: number | null;
    y: number | null;
}
const getItemPosition = (el: HTMLElement) => {
    const box = window.getComputedStyle(el);
    return {
        x: parseFloat(box.top),
        y: parseFloat(box.left),
    };
};

const getItemPositionInParent = (el: HTMLElement) => {
    const box = window.getComputedStyle(el);
    const parentBox = window.getComputedStyle(el.parentElement!);
    return {
        x: parseFloat(box.top) - parseFloat(parentBox.top),
        y: parseFloat(box.left) - parseFloat(parentBox.left),
    };
};
type Watch = 'measure-once' | 'watch-sizes' | 'ignore';
export const usePosition = (element: React.RefObject<HTMLElement>, watchPosition: Pos | boolean = false): Pos => {
    const watch: Watch = typeof watchPosition === 'object' ? 'ignore' : watchPosition ? 'watch-sizes' : 'measure-once';
    return useElementResizeEffect(element, getItemPosition, watch, defaultPos);
};
export const usePositionInParent = (
    element: React.RefObject<HTMLElement>,
    watchPosition: Pos | boolean = false
): Pos => {
    const watch: Watch = typeof watchPosition === 'object' ? 'ignore' : watchPosition ? 'watch-sizes' : 'measure-once';
    return useElementResizeEffect(element, getItemPositionInParent, watch, defaultPos);
};

export const useElementResizeEffect = <T, U = null>(
    element: React.RefObject<HTMLElement>,
    onElementUpdate: (el: HTMLElement) => T,
    watch?: 'measure-once' | 'watch-sizes' | 'ignore',
    def: T | U = null as unknown as U
): T | U => {
    const [state, update] = useState(def);
    useLayoutEffect(() => {
        let observer: ResizeObserver;
        if (watch === 'ignore') {
            return;
        }

        const onElement = () => {
            update(onElementUpdate(element.current!));
            if (watch === 'watch-sizes') {
                observer = new ResizeObserver(() => update(onElementUpdate(element.current!)));
                observer.observe(element.current!);

                return () => {
                    observer.disconnect();
                };
            }
            return () => {
                //
            };
        };
        if (element.current) {
            return onElement();
        }
        return waitForRef(element, onElement);
    }, [element, onElementUpdate, watch]);
    return state;
};
