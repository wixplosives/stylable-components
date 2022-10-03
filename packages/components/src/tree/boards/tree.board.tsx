import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { getChildren, TreeItemData } from '../../board-assets';
import { projectThemesPlugin } from '../../board-plugins';
import { TreeItemRenderer } from '../../tree-items/tree-item-renderer';
import { Tree } from '../tree';

const createItem = (maxChildren: number, maxDepth: number, currentDepth = 0, path: number[] = []) => {
    const item: TreeItemData = {
        id: `item_${currentDepth}_${path.toString()}`,
        title: `item_${currentDepth}_${path.toString()}`,
    };
    if (currentDepth < maxDepth) {
        const numChildren = Math.floor(Math.random() * (maxChildren + 1));
        item.children = new Array(numChildren).fill(undefined).map((_, idx) => {
            return createItem(maxChildren, maxDepth, currentDepth + 1, [...path, idx]);
        });
    }
    return item;
};
export default createBoard({
    name: 'Tree',
    Board: () => (
        <Tree
            ItemRenderer={TreeItemRenderer}
            data={createItem(20, 5)}
            getId={(item: TreeItemData) => item.id}
            getChildren={getChildren}
            scrollOffset={50}
            openItemsControls={() => []}
        />
    ),
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 264,
        windowHeight: 600,
        windowWidth: 1024,
    },
});
