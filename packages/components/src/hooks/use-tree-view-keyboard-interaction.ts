import React, { useCallback, useEffect } from 'react';
import { KeyCodes } from '../common/index.js';
import { ProcessedControlledState } from './use-state-controls.js';

export type KeyboardSelectMeta = 'keyboard';
export interface TreeViewKeyboardInteractionsParams {
    eventRoots?: React.RefObject<HTMLElement | null>[];
    focusedItemId: string | undefined;
    open: (itemId: string) => void;
    close: (itemId: string) => void;
    focus: (itemId: string) => void;
    select: ProcessedControlledState<string, KeyboardSelectMeta>[1];
    isOpen: (itemId: string) => boolean;
    isEndNode: (itemId: string) => boolean;
    getPrevious: (itemId: string) => string | undefined;
    getNext: (itemId: string) => string | undefined;
    getParent: (itemId: string) => string | undefined;
    getFirstChild: (itemId: string) => string | undefined;
    getFirst: () => string | undefined;
    getLast: () => string | undefined;
}

export interface KeyboardInteractionConfiguration {
    /**
     * In a single-select tree, moving focus may optionally unselect the previously selected node
     * and select the newly focused node.
     */
    selectionFollowsFocus?: boolean;
    /**
     * Non-standard behavior: when focus is on an end node, pressing the right arrow key will select
     * the next sibling, or, in case of last child, the next sibling of the parent node.
     */
    endNodeExpandSelectsNext?: boolean;
}

/**
 * Trying to align to https://www.w3.org/WAI/ARIA/apg/patterns/treeview/ "Keyboard Interaction" section;
 * for non-standard behavior, see the `KeyboardInteractionConfiguration` configuration options.
 */
export const useTreeViewKeyboardInteraction = ({
    eventRoots,
    focusedItemId,
    isEndNode,
    getPrevious,
    getNext,
    getFirst,
    getLast,
    getParent,
    getFirstChild,
    isOpen,
    open,
    close,
    focus,
    select,
    endNodeExpandSelectsNext,
    selectionFollowsFocus,
}: TreeViewKeyboardInteractionsParams & KeyboardInteractionConfiguration) => {
    const handleFocus = useCallback(
        (itemId: string | undefined) => {
            if (!itemId) return;

            if (selectionFollowsFocus) {
                select(itemId, 'keyboard');
            } else {
                focus(itemId);
            }
        },
        [focus, select, selectionFollowsFocus],
    );

    const selectFocused = useCallback(() => {
        if (!focusedItemId) {
            return;
        }
        select(focusedItemId);
    }, [focusedItemId, select]);

    const handleArrowRight = useCallback(() => {
        if (!focusedItemId) return;

        if (isEndNode(focusedItemId)) {
            if (!endNodeExpandSelectsNext) return;

            handleFocus(getNext(focusedItemId));
        } else if (isOpen(focusedItemId)) {
            handleFocus(getFirstChild(focusedItemId));
        } else {
            open(focusedItemId);
        }
    }, [focusedItemId, isEndNode, isOpen, endNodeExpandSelectsNext, getFirstChild, getNext, open, handleFocus]);

    const handleArrowLeft = useCallback(() => {
        if (!focusedItemId) return;

        if (!isOpen(focusedItemId)) {
            handleFocus(getParent(focusedItemId));
        } else {
            close(focusedItemId);
        }
    }, [focusedItemId, getParent, isOpen, close, handleFocus]);

    const handleArrowUp = useCallback(() => {
        if (!focusedItemId) return;

        handleFocus(getPrevious(focusedItemId));
    }, [focusedItemId, getPrevious, handleFocus]);

    const handleArrowDown = useCallback(() => {
        if (!focusedItemId) return;

        handleFocus(getNext(focusedItemId));
    }, [focusedItemId, getNext, handleFocus]);

    const handleHome = useCallback(() => handleFocus(getFirst()), [getFirst, handleFocus]);

    const handleEnd = useCallback(() => handleFocus(getLast()), [getLast, handleFocus]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const handler = {
                [KeyCodes.ArrowRight]: handleArrowRight,
                [KeyCodes.ArrowLeft]: handleArrowLeft,
                [KeyCodes.ArrowUp]: handleArrowUp,
                [KeyCodes.ArrowDown]: handleArrowDown,
                [KeyCodes.Home]: handleHome,
                [KeyCodes.End]: handleEnd,
                [KeyCodes.Space]: selectFocused,
                [KeyCodes.Enter]: selectFocused,
            }[event.code];
            if (!handler) return;

            event.preventDefault();

            handler();
        },
        [handleArrowRight, handleArrowLeft, handleArrowUp, handleArrowDown, handleHome, handleEnd, selectFocused],
    );

    useEffect(() => {
        if (!eventRoots) return;

        for (const currentEventsRoot of eventRoots) {
            if (!currentEventsRoot.current) continue;

            currentEventsRoot.current.addEventListener('keydown', onKeyDown);
        }

        return () => {
            for (const currentEventsRoot of eventRoots) {
                if (!currentEventsRoot.current) continue;

                currentEventsRoot.current.removeEventListener('keydown', onKeyDown);
            }
        };
    }, [eventRoots, onKeyDown]);
};
