/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import {
    calcItemSize,
    TreeItemWithLaneData,
    TreeItemWithLaneRenderer,
} from '../../tree-items/tree-item-with-lane-renderer';
import { Tree } from '../tree';
import type { ElementData } from '../../tree-items/lanes/element-item-renderer';
import type { LaneData, LaneItem } from '../../tree-items/lanes/lane-item-renderer';
import type { MarkerData } from '../../tree-items/lanes/marker-item-renderer';

const ElementTitles = ['div', 'span', 'p'];
function randomItem<T>(arr: T[]) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx]!;
}
const createElementItem = (path: number[] = []): ElementData<TreeItemWithLaneData> => ({
    id: `item_${path.toString()}`,
    tagName: randomItem(ElementTitles),
    kind: 'element',
});

const laneSubitems: LaneItem[] = [
    {
        color: 'red',
        title: 'Error',
    },
    {
        color: 'blue',
        title: 'repeater',
    },
];

const createLaneItem = (path: number[] = []): LaneData<TreeItemWithLaneData> => {
    const numChildren = Math.floor(Math.random() * 5);
    return {
        id: `item_${path.toString()}`,
        kind: 'lane',
        items: new Array(numChildren).fill(undefined).map((_) => {
            return randomItem(laneSubitems);
        }),
    };
};

const markerTitles = ['children', 'header', 'footer'];
const createMarkerItem = (path: number[] = []): MarkerData<TreeItemWithLaneData> => ({
    id: `item_${path.toString()}`,
    kind: 'marker',
    title: randomItem(markerTitles),
});

const kinds: TreeItemWithLaneData['kind'][] = ['element', 'lane', 'marker'];
const createItem = (maxChildren: number, maxDepth: number, currentDepth = 0, path: number[] = []) => {
    const kind = randomItem(kinds);
    const item = (() => {
        switch (kind) {
            case 'element':
                return createElementItem(path);
            case 'lane':
                return createLaneItem(path);
            case 'marker':
                return createMarkerItem(path);
        }
    })();
    if (currentDepth < maxDepth) {
        const numChildren = Math.floor(Math.random() * (maxChildren + 1));
        item.children = new Array(numChildren).fill(undefined).map((_, idx) => {
            return createItem(maxChildren, maxDepth, currentDepth + 1, [...path, idx]);
        });
    }
    return item;
};
export default createDemo<Tree<TreeItemWithLaneData>>({
    name: 'Tree with lanes',
    demo: () => {
        return (
            <Tree
                ItemRenderer={TreeItemWithLaneRenderer}
                data={createItem(20, 5)}
                getId={(item: TreeItemWithLaneData) => item.id}
                getChildren={(item: TreeItemWithLaneData) => item.children || []}
                initialScrollOffset={50}
                openItemsControls={() => []}
                openItemsByDefault={false}
                itemSize={calcItemSize}
            />
        );
    },
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        windowHeight: 600,
        windowWidth: 1024,
    },
});
