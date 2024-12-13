import React from 'react';
import type { TreeItemWithLaneData } from '../../tree-items/tree-item-with-lane-renderer.js';

export const lanesContext = React.createContext({
    getIndent(_item: TreeItemWithLaneData): number {
        return 0;
    },
    getParents(_item: TreeItemWithLaneData): TreeItemWithLaneData[] {
        return [];
    },
    selectItem(_item: TreeItemWithLaneData) {
        //
    },
});
