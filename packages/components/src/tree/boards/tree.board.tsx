import { createBoard } from '@wixc3/react-board';
import React, { useState } from 'react';
import { getChildren, getId, TreeItemData } from '../../board-assets';
import { TreeItemRenderer } from '../../board-assets/tree-items/tree-item-renderer';
import { projectThemesPlugin } from '../../board-plugins';
import { Tree } from '../tree';

const createTreeData = (maxChildren: number, maxDepth: number, currentDepth = 0, path: number[] = []) => {
    const item: TreeItemData = {
        id: `item_${currentDepth}_${path.toString()}`,
        title: `item_${currentDepth}_${path.toString()}`,
    };
    ids.push(item.id);
    if (currentDepth < maxDepth) {
        const randomNumberOfChildren = Math.floor(Math.random() * (maxChildren + 1));
        const numChildren = currentDepth === 0 ? Math.max(10, randomNumberOfChildren) : randomNumberOfChildren;
        item.children = new Array(numChildren).fill(undefined).map((_, idx) => {
            return createTreeData(maxChildren, maxDepth, currentDepth + 1, [...path, idx]);
        });
    }
    return item;
};
const ids: string[] = [];
const treeData = createTreeData(6, 3);
const elementRef: React.RefObject<HTMLDivElement> = {
    current: null,
};

export default createBoard({
    name: 'Tree',
    Board: () => {
        const [openItems, setOpenItems] = useState(ids);

        return (
            <Tree
                scrollWindow={elementRef}
                ItemRenderer={TreeItemRenderer}
                data={treeData}
                getId={getId}
                getChildren={getChildren}
                itemSize={() => 24}
                scrollListRoot={{
                    el: 'div',
                    props: {
                        id: 'list',
                        style: {
                            width: '200px',
                            height: '400px',
                            overflow: 'auto',
                        },
                        ref: elementRef,
                    },
                }}
                openItemsControls={[openItems, setOpenItems]}
            />
        );
    },
    plugins: [projectThemesPlugin],
    environmentProps: {
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 575,
        canvasHeight: 525,
    },
});
