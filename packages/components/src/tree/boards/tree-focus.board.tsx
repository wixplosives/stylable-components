import { createBoard } from '@wixc3/react-board';
import React, { useRef, useState } from 'react';
import { Tree } from '../tree.js';
import { TreeItemData } from '../../board-assets/index.js';
import { TreeItemRenderer } from '../../board-assets/tree-items/tree-item-renderer.js';
import {
    clickAction,
    expectElement,
    expectElementStyle,
    focusAction,
    hoverAction,
    keyDownAction,
    scenarioPlugin,
} from '../../board-plugins/index.js';
import { KeyCodes } from '../../common/index.js';

const data: TreeItemData = {
    id: '1',
    title: 'item 1',
    children: [
        { id: '2', title: 'item 2' },
        { id: '3', title: 'item 3' },
        { id: '4', title: 'item 4' },
        { id: '5', title: 'item 5' },
        { id: '6', title: 'item 6' },
    ],
};

export default createBoard({
    name: 'Tree Focus and Others',
    Board: () => {
        const openItemsControl = useState<string[]>([]);
        const scrollRef = useRef<HTMLDivElement>(null);
        const selectionControl = useState<string | undefined>();
        return (
            <div>
                <Tree<typeof data>
                    data={data}
                    getId={(it) => it.id}
                    ItemRenderer={TreeItemRenderer}
                    getChildren={(it) => it.children || []}
                    openItemsControls={openItemsControl}
                    selectionControl={selectionControl}
                    overlay={{ el: () => null, props: {} }}
                    listRoot={{
                        props: {
                            ref: scrollRef,
                            id: 'LIST',
                        },
                    }}
                    eventRoots={[scrollRef]}
                />
                <button id="clear" onClick={() => selectionControl[1](undefined)}>
                    clear selection
                </button>
                <button id="select" onClick={() => selectionControl[1]('5')}>
                    select 5
                </button>
            </div>
        );
    },
    plugins: [
        scenarioPlugin.use({
            title: 'tree focus should follow select and not hover',
            events: [
                clickAction('[data-id="1"]'),
                keyDownAction('[data-id="1"]', KeyCodes.ArrowRight, 39),
                expectElement('[data-id="2"]'),
                hoverAction('[data-id="3"]'),
                keyDownAction('[data-id="1"]', KeyCodes.ArrowDown, 40),
                expectElementStyle('[data-id="2"]', { color: 'rgb(0, 0, 255)' }), //blue (focused)
                clickAction('#clear'),
                expectElementStyle('[data-id="2"]', { color: 'rgb(0, 0, 0)' }), //black (not focused)
                clickAction('#select'),
                focusAction('#LIST'),
                keyDownAction('[data-id="5"]', KeyCodes.ArrowDown, 40),
                expectElementStyle('[data-id="6"]', { color: 'rgb(0, 0, 255)' }), //blue (focused)
            ],
        }),
    ],
    environmentProps: {
        windowWidth: 600,
        windowHeight: 400,
    },
});
