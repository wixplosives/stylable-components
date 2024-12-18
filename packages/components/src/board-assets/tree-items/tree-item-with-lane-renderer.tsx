import React from 'react';
import { LaneData, calcLaneSize } from '../tree-items/lanes/lane-item-renderer.js';
import { ElementData, ElementRenderer, calcElementSize } from '../tree-items/lanes/element-item-renderer.js';
import { MarkerData, MarkerRenderer, calcMarkerSize } from '../tree-items/lanes/marker-item-renderer.js';
import type { TreeItemInfo, TreeItemProps } from '../../tree/index.js';

export type TreeItemWithLaneData =
    | LaneData<TreeItemWithLaneData>
    | ElementData<TreeItemWithLaneData>
    | MarkerData<TreeItemWithLaneData>;

export const calcItemSize = (item: TreeItemInfo<TreeItemWithLaneData>) => {
    return item.data.kind === 'element'
        ? calcElementSize(item as TreeItemInfo<ElementData<TreeItemWithLaneData>>)
        : item.data.kind === 'lane'
          ? calcLaneSize(item as TreeItemInfo<LaneData<TreeItemWithLaneData>>)
          : calcMarkerSize(item as TreeItemInfo<MarkerData<TreeItemWithLaneData>>);
};

export const TreeItemWithLaneRenderer: React.FC<TreeItemProps<TreeItemWithLaneData>> = (props) => {
    return props.data.kind === 'element' ? (
        <ElementRenderer {...(props as TreeItemProps<ElementData<TreeItemWithLaneData>>)} />
    ) : props.data.kind === 'lane' ? null : (
        <MarkerRenderer {...(props as TreeItemProps<MarkerData<TreeItemWithLaneData>>)} />
    );
};
