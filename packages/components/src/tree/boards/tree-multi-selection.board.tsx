import { createBoard } from '@wixc3/react-board';
import React, { useEffect, useRef, useState } from 'react';
import { Tree } from '../tree.js';
import { TreeItemData } from '../../board-assets/index.js';
import { TreeItemRenderer } from '../../board-assets/tree-items/tree-item-renderer.js';
import {
    scenarioPlugin,
    clickAction,
    keyDownAction,
    expectElement,
    expectElementStyle,
    expectElementsStyle,
} from '../../board-plugins/index.js';
import { KeyCodes } from '../../common/keycodes.js';
import { DEFAULT_STYLE, FOCUSED_STYLE, SELECTED_STYLE } from './consts.js';

const data: TreeItemData = {
    id: '1',
    title: 'item 1',
    children: [
        {
            id: '2',
            title: 'item 2',
            children: [
                {
                    id: '2.1',
                    title: 'item 2.1',
                    children: [
                        { id: '2.1.1', title: 'item 2.1.1' },
                        { id: '2.1.2', title: 'item 2.1.2' },
                        { id: '2.1.3', title: 'item 2.1.3' },
                    ],
                },
            ],
        },
        { id: '3', title: 'item 3' },
        { id: '4', title: 'item 4' },
        { id: '5', title: 'item 5' },
        { id: '6', title: 'item 6' },
    ],
};

export default createBoard({
    name: 'Tree multi-selection',
    Board: () => {
        const openItemsControl = useState<string[]>([]);
        const scrollRef = useRef<HTMLDivElement>(null);

        const [keys, setKeys] = useState<string[]>([]);

        useEffect(() => {
            const keyDownHandler = (event: KeyboardEvent) => {
                if (!keys.includes(event.key)) {
                    setKeys([...keys, event.key]);
                }
            };

            const keyUpHandler = (event: KeyboardEvent) => {
                setKeys(keys.filter((key) => key !== event.key));
            };

            document.addEventListener('keydown', keyDownHandler);
            document.addEventListener('keyup', keyUpHandler);

            return () => {
                document.removeEventListener('keydown', keyDownHandler);
                document.removeEventListener('keyup', keyUpHandler);
            };
        }, [keys]);

        return (
            <div>
                <div>
                    <span>Key pressed: {keys.join(', ')}</span>
                </div>

                <Tree<typeof data>
                    data={data}
                    getId={(it) => it.id}
                    ItemRenderer={TreeItemRenderer}
                    getChildren={(it) => it.children || []}
                    openItemsControls={openItemsControl}
                    overlay={{ el: () => null, props: {} }}
                    listRoot={{
                        props: {
                            ref: scrollRef,
                            id: 'LIST',
                            style: { outline: 'none', width: '12rem' },
                        },
                    }}
                    eventRoots={[scrollRef]}
                />
            </div>
        );
    },
    plugins: [
        scenarioPlugin.use({
            title: 'tree multi selection test',
            events: [
                clickAction('[data-id="1"]'),
                keyDownAction('#LIST', KeyCodes.ArrowRight, { which: 39 }),
                expectElement('[data-id="2"]'),
                // basic range multi-selection using the shift key
                keyDownAction('[data-id="1"]', KeyCodes.ArrowDown, { which: 40, shiftKey: true }),
                expectElementsStyle({
                    [`data-id="1"`]: SELECTED_STYLE,
                    [`data-id="2"`]: SELECTED_STYLE,
                }),
                // checking two sets of ranges
                // 1 <- selected
                // 2 <- selected
                // 3
                // 4 <- selected
                keyDownAction('[data-id="2"]', KeyCodes.ArrowDown, { which: 40 }),
                expectElement('[data-id="3"]'),
                keyDownAction('[data-id="3"]', KeyCodes.ArrowDown, { which: 40, shiftKey: true }),
                expectElementsStyle({
                    [`data-id="1"`]: SELECTED_STYLE,
                    [`data-id="2"`]: SELECTED_STYLE,
                    [`data-id="3"`]: DEFAULT_STYLE,
                    [`data-id="4"`]: SELECTED_STYLE,
                }),
                // clears multi selection on click
                clickAction('[data-id="3"]'),
                expectElementsStyle({
                    [`data-id="1"`]: DEFAULT_STYLE,
                    [`data-id="2"`]: DEFAULT_STYLE,
                    [`data-id="3"`]: SELECTED_STYLE,
                    [`data-id="4"`]: DEFAULT_STYLE,
                    [`data-id="5"`]: DEFAULT_STYLE,
                    [`data-id="6"`]: DEFAULT_STYLE,
                }),
                // selects the range from up to down using click and shift
                clickAction('[data-id="5"]', 2000, { shiftKey: true }),
                expectElementsStyle({
                    [`data-id="3"`]: SELECTED_STYLE,
                    [`data-id="4"`]: SELECTED_STYLE,
                    [`data-id="5"`]: SELECTED_STYLE,
                }),
                // validates the anchor functionality
                // selects the range from down to up using click and shift.
                clickAction('[data-id="1"]', 2000, { shiftKey: true }),
                expectElementsStyle({
                    [`data-id="1"`]: SELECTED_STYLE,
                    [`data-id="2"`]: SELECTED_STYLE,
                    [`data-id="3"`]: SELECTED_STYLE,
                }),
                // removes already selected element with shift
                clickAction('[data-id="2"]', 2000, { shiftKey: true }),
                expectElementsStyle({
                    [`data-id="1"`]: DEFAULT_STYLE,
                    [`data-id="2"`]: SELECTED_STYLE,
                    [`data-id="3"`]: SELECTED_STYLE,
                }),
                // validates multi-selection using click+ctrl key
                clickAction('[data-id="1"]'),
                clickAction('[data-id="3"]', 2000, { ctrlKey: true }),
                clickAction('[data-id="5"]', 2000, { ctrlKey: true }),
                expectElementsStyle({
                    [`data-id="1"`]: SELECTED_STYLE,
                    [`data-id="2"`]: SELECTED_STYLE,
                    [`data-id="3"`]: DEFAULT_STYLE,
                    [`data-id="4"`]: SELECTED_STYLE,
                    [`data-id="5"`]: DEFAULT_STYLE,
                    [`data-id="6"`]: SELECTED_STYLE,
                }),
                // validates clearing selected item using click+ctrl key
                clickAction('[data-id="1"]', 2000, { ctrlKey: true }),
                expectElementStyle('[data-id="1"]', FOCUSED_STYLE),
            ],
        }),
    ],
    environmentProps: {
        windowWidth: 600,
        windowHeight: 559,
    },
});
