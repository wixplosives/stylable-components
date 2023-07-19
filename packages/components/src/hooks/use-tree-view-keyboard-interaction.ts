import React, { useCallback, useEffect } from 'react';
import { KeyCodes } from '../common';

export interface TreeViewKeyboardInteractionsParams {
    eventRoots?: React.RefObject<HTMLElement>[];
    focusedItemId: string | undefined;
    open: (itemId: string) => void;
    close: (itemId: string) => void;
    focus: (itemId: string) => void;
    select: (itemId: string) => void;
    isOpen: (itemId: string) => boolean;
    isEndNode: (itemId: string) => boolean;
    getPrevious: (itemId: string) => string | undefined;
    getNext: (itemId: string) => string | undefined;
    getParent: (itemId: string) => string | undefined;
    getFirstChild: (itemId: string) => string | undefined;
    getFirst: () => string | undefined;
    getLast: () => string | undefined;
}

interface KeyboardInteractionConfiguration {
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
    endNodeExpandSelectsNext = true, // TODO: move to Codux, default should be false
    selectionFollowsFocus = true, // TODO: move to Codux, default should be false
}: TreeViewKeyboardInteractionsParams & KeyboardInteractionConfiguration) => {
    const handleArrowRight = useCallback(() => {
        if (!focusedItemId) return;

        if (isEndNode(focusedItemId)) {
            if (!endNodeExpandSelectsNext) return;

            const next = getNext(focusedItemId);

            if (next) {
                focus(next);
                selectionFollowsFocus && select(next);
            }
        } else if (isOpen(focusedItemId)) {
            const firstChild = getFirstChild(focusedItemId);

            if (firstChild) {
                focus(firstChild);
                selectionFollowsFocus && select(firstChild);
            }
        } else {
            open(focusedItemId);
        }
    }, [
        endNodeExpandSelectsNext,
        focus,
        focusedItemId,
        getFirstChild,
        getNext,
        isEndNode,
        isOpen,
        open,
        select,
        selectionFollowsFocus,
    ]);

    const handleArrowLeft = useCallback(() => {
        if (!focusedItemId) return;

        if (!isOpen(focusedItemId)) {
            const parent = getParent(focusedItemId);

            if (parent) {
                focus(parent);
                selectionFollowsFocus && select(parent);
            }
        } else {
            close(focusedItemId);
        }
    }, [close, focus, focusedItemId, getParent, isOpen, select, selectionFollowsFocus]);

    const handleArrowUp = useCallback(() => {
        if (!focusedItemId) return;

        const previous = getPrevious(focusedItemId);
        if (previous) {
            focus(previous);
            selectionFollowsFocus && select(previous);
        }
    }, [focus, focusedItemId, getPrevious, select, selectionFollowsFocus]);

    const handleArrowDown = useCallback(() => {
        if (!focusedItemId) return;

        const next = getNext(focusedItemId);

        if (next) {
            focus(next);
            selectionFollowsFocus && select(next);
        }
    }, [focus, focusedItemId, getNext, select, selectionFollowsFocus]);

    const handleHome = useCallback(() => {
        const first = getFirst();

        if (first) {
            focus(first);
            selectionFollowsFocus && select(first);
        }
    }, [focus, getFirst, select, selectionFollowsFocus]);

    const handleEnd = useCallback(() => {
        const last = getLast();

        if (last) {
            focus(last);
            selectionFollowsFocus && select(last);
        }
    }, [focus, getLast, select, selectionFollowsFocus]);

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const handler = {
                [KeyCodes.ArrowRight]: handleArrowRight,
                [KeyCodes.ArrowLeft]: handleArrowLeft,
                [KeyCodes.ArrowUp]: handleArrowUp,
                [KeyCodes.ArrowDown]: handleArrowDown,
                [KeyCodes.Home]: handleHome,
                [KeyCodes.End]: handleEnd,
            }[event.code];

            if (!handler) return;

            event.preventDefault();

            handler();
        },
        [handleArrowRight, handleArrowLeft, handleArrowUp, handleArrowDown, handleHome, handleEnd]
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
