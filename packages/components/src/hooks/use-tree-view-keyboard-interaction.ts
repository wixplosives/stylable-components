import React, { useCallback, useEffect } from 'react';
import { KeyCodes } from '../common';

interface TreeViewKeyboardInteractionsParams {
    eventsRoot?: React.RefObject<HTMLElement>;
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
    eventsRoot,
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
    const handleArrowRight = useCallback(
        (event: KeyboardEvent) => {
            if (!focusedItemId) return;

            if (isEndNode(focusedItemId) && !endNodeExpandSelectsNext) {
                return;
            } else if (isEndNode(focusedItemId) && endNodeExpandSelectsNext) {
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

            event.preventDefault();
        },
        [
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
        ]
    );

    const handleArrowLeft = useCallback(
        (event: KeyboardEvent) => {
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

            event.preventDefault();
        },
        [close, focus, focusedItemId, getParent, isOpen, select, selectionFollowsFocus]
    );

    const handleArrowUp = useCallback(
        (event: KeyboardEvent) => {
            if (!focusedItemId) return;

            const previous = getPrevious(focusedItemId);
            if (previous) {
                focus(previous);
                selectionFollowsFocus && select(previous);
            }

            event.preventDefault();
        },
        [focus, focusedItemId, getPrevious, select, selectionFollowsFocus]
    );

    const handleArrowDown = useCallback(
        (event: KeyboardEvent) => {
            if (!focusedItemId) return;

            const next = getNext(focusedItemId);

            if (next) {
                focus(next);
                selectionFollowsFocus && select(next);
            }

            event.preventDefault();
        },
        [focus, focusedItemId, getNext, select, selectionFollowsFocus]
    );

    const handleHome = useCallback(
        (event: KeyboardEvent) => {
            const first = getFirst();

            if (first) {
                focus(first);
                selectionFollowsFocus && select(first);
            }

            event.preventDefault();
        },
        [focus, getFirst, select, selectionFollowsFocus]
    );

    const handleEnd = useCallback(
        (event: KeyboardEvent) => {
            const last = getLast();

            if (last) {
                focus(last);
                selectionFollowsFocus && select(last);
            }

            event.preventDefault();
        },
        [focus, getLast, select, selectionFollowsFocus]
    );

    const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
            switch (event.code) {
                case KeyCodes.ArrowRight:
                    handleArrowRight(event);
                    break;
                case KeyCodes.ArrowLeft:
                    handleArrowLeft(event);
                    break;
                case KeyCodes.ArrowUp:
                    handleArrowUp(event);
                    break;
                case KeyCodes.ArrowDown:
                    handleArrowDown(event);
                    break;
                case KeyCodes.Home:
                    handleHome(event);
                    break;
                case KeyCodes.End:
                    handleEnd(event);
                    break;
            }
        },
        [handleArrowRight, handleArrowLeft, handleArrowUp, handleArrowDown, handleHome, handleEnd]
    );

    useEffect(() => {
        const currentEventsRoot = eventsRoot?.current;
        if (!currentEventsRoot) return;

        currentEventsRoot.addEventListener('keydown', onKeyDown);
        return () => currentEventsRoot.removeEventListener('keydown', onKeyDown);
    }, [eventsRoot, onKeyDown]);
};
