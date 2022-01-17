import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { TreeItemData, TreeItemRenderer } from '../../tree-items/tree-item-renderer';
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
export default createDemo<Tree<TreeItemData>>({
    name: 'Tree',
    demo: () => (
        <Tree
            ItemRenderer={TreeItemRenderer}
            data={createItem(20, 5)}
            getId={(item: TreeItemData) => item.id}
            getChildren={(item: TreeItemData) => item.children || []}
            initialScrollOffset={50}
            openItemsControls={()=>[]}
            openItemsByDefault={false}
        />
    ),
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        windowHeight: 600,
        windowWidth: 1024,
    },
});
