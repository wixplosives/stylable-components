import { createBoard } from '@wixc3/react-board';
import React, { useState } from 'react';
import { getChildren, getId, TreeItemData } from '../../board-assets/items';
import { projectThemesPlugin } from '../../board-plugins';
import { TreeItemRenderer } from '../../tree-items/tree-item-renderer';
import { Tree } from '../tree';

const createTreeData = (maxChildren: number, maxDepth: number, currentDepth = 0, path: number[] = []) => {
    const item: TreeItemData = {
        id: `item_${currentDepth}_${path.toString()}`,
        title: `item_${currentDepth}_${path.toString()}`,
    };
    ids.push(item.id);
    if (currentDepth < maxDepth) {
        const numChildren = Math.floor(Math.random() * (maxChildren + 1));
        item.children = new Array(numChildren).fill(undefined).map((_, idx) => {
            return createTreeData(maxChildren, maxDepth, currentDepth + 1, [...path, idx]);
        });
    }
    return item;
};
const ids: string[] = [];
const treeData = createTreeData(100, 1);

export default createBoard({
    name: 'Tree',
    Board: () => {
        const [openItems, setOpenItems] = useState(ids);

        return (
            <Tree
                ItemRenderer={TreeItemRenderer}
                data={treeData}
                getId={getId}
                getChildren={getChildren}
                openItemsControls={[openItems, setOpenItems]}
            />
        );
    },
    plugins: [projectThemesPlugin],
    environmentProps: {
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 500,
    },
});
