import React from 'react';
import { childrenById, KeyCodes } from '../common/index.js';
import { ListSelection } from '../list/types.js';

export const getHandleKeyboardNav = (
    elementsParent: React.RefObject<HTMLElement | null>,
    focusedId: string | undefined,
    setFocusedId: (id: string) => void,
    setSelectedIds: (selectedData: ListSelection) => void,
) => {
    const onKeyPress = (ev: React.KeyboardEvent) => {
        if (
            ev.target instanceof HTMLInputElement ||
            ev.target instanceof HTMLTextAreaElement ||
            !focusedId ||
            !elementsParent.current
        ) {
            return;
        }

        const element = elementsParent.current;
        const children = childrenById(element);
        const currentFocused = children[focusedId];
        if (!currentFocused) {
            return;
        }
        const gotoDir = (dir: 'up' | 'down' | 'left' | 'right') => {
            const focusedRect = currentFocused.getBoundingClientRect();
            let nextId: string | null = null;
            let nextIdDistance = Number.MAX_SAFE_INTEGER;
            let nextElement: Element | null = null;
            const focusMiddle =
                dir === 'up'
                    ? (focusedRect.top + focusedRect.height / 2) * -1
                    : dir === 'down'
                      ? focusedRect.top + focusedRect.height / 2
                      : dir === 'left'
                        ? (focusedRect.left + focusedRect.width / 2) * -1
                        : focusedRect.left + focusedRect.width / 2;
            const focusLeft =
                dir === 'up'
                    ? focusedRect.left
                    : dir === 'down'
                      ? focusedRect.left
                      : dir === 'left'
                        ? focusedRect.top
                        : focusedRect.top;
            const focusRight =
                dir === 'up'
                    ? focusedRect.right
                    : dir === 'down'
                      ? focusedRect.right
                      : dir === 'left'
                        ? focusedRect.bottom
                        : focusedRect.bottom;
            for (const [id, element] of Object.entries(children)) {
                if (id !== focusedId) {
                    const rect = element.getBoundingClientRect();
                    const rectStart =
                        dir === 'up'
                            ? rect.bottom * -1
                            : dir === 'down'
                              ? rect.top
                              : dir === 'left'
                                ? rect.right * -1
                                : rect.left;
                    const rectLeft =
                        dir === 'up' ? rect.left : dir === 'down' ? rect.left : dir === 'left' ? rect.top : rect.top;
                    const rectRight =
                        dir === 'up'
                            ? rect.right
                            : dir === 'down'
                              ? rect.right
                              : dir === 'left'
                                ? rect.bottom
                                : rect.bottom;
                    if (rectStart > focusMiddle) {
                        const distanceMain = rectStart - focusMiddle;

                        const distanceSides = Math.max(
                            Math.max(rectLeft - focusLeft, 0),
                            Math.max(focusRight - rectRight, 0),
                            0,
                        );
                        const distance = Math.sqrt(Math.pow(distanceMain, 2) + Math.pow(distanceSides, 2));
                        if (distance < nextIdDistance) {
                            nextId = id;
                            nextIdDistance = distance;
                            nextElement = element;
                        }
                    }
                }
            }
            if (nextId) {
                setFocusedId(nextId);
                if (nextElement) {
                    nextElement.scrollIntoView({
                        behavior: 'smooth',
                        inline: 'nearest',
                        block: 'nearest',
                    });
                }
            }
        };
        switch (ev.code as KeyCodes) {
            case KeyCodes.ArrowLeft: {
                gotoDir('left');
                break;
            }
            case KeyCodes.ArrowRight:
                gotoDir('right');
                break;
            case KeyCodes.ArrowUp:
                gotoDir('up');
                break;
            case KeyCodes.ArrowDown:
                gotoDir('down');
                break;
            case KeyCodes.Space:
            case KeyCodes.Enter:
                setSelectedIds({ lastSelectedId: focusedId, ids: [focusedId] });
                break;
            default:
        }
    };
    return onKeyPress;
};
