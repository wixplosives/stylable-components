import { createBoard } from '@wixc3/react-board';
import React, { useRef, useState } from 'react';
import { Tree } from '../tree.js';
import { TreeItemData } from '../../board-assets/index.js';
import { TreeItemRenderer } from '../../board-assets/tree-items/tree-item-renderer.js';

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
        return (
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
        );
    },
    // plugins: [
    //     scenarioPlugin.use({
    //         title: 'tree focus test',
    //         events: [
    //             clickAction('[data-id="1"]'),
    //             keyDownAction('#LIST', KeyCodes.ArrowRight, 39),
    //             expectElement('[data-id="2"]'),
    //             keyDownAction('[data-id="1"]', KeyCodes.ArrowDown, 40),
    //             expectElementStyle('[data-id="2"]', { color: 'rgb(0, 0, 255)' }), //blue (focused)
    //             keyDownAction('[data-id="2"]', KeyCodes.Space, 32),
    //             expectElementStyle('[data-id="2"]', { textDecorationLine: 'underline' }),
    //             keyDownAction('[data-id="2"]', KeyCodes.Home, 36),
    //             expectElementStyle('[data-id="1"]', { color: 'rgb(0, 0, 255)' }), //blue (focused)
    //             keyDownAction('[data-id="1"]', KeyCodes.End, 35),
    //             expectElementStyle('[data-id="6"]', { color: 'rgb(0, 0, 255)' }), //blue (focused)
    //             keyDownAction('[data-id="6"]', KeyCodes.Enter, 13),
    //             expectElementStyle('[data-id="6"]', { textDecorationLine: 'underline' }), //selected
    //         ],
    //     }),
    // ],
    environmentProps: {
        windowWidth: 600,
        windowHeight: 400,
    },
});
