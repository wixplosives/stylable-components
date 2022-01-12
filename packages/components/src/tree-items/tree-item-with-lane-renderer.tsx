import React from 'react';
import { LaneData, LaneRenderer } from './lanes/lane-item-renderer';
import { ElementData, ElementRenderer } from './lanes/element-item-renderer';
import { MarkerData, MarkerRenderer } from './lanes/marker-item-renderer';
import type { TreeItemProps } from '../tree/tree';

export type TreeItemWithLaneData =
    | LaneData<TreeItemWithLaneData>
    | ElementData<TreeItemWithLaneData>
    | MarkerData<TreeItemWithLaneData>;

export const calcItemSize = (item: TreeItemWithLaneData) => (item.kind === 'lane' ? 20 : 30);

export const TreeItemWithLaneRenderer: React.FC<TreeItemProps<TreeItemWithLaneData>> = (props) => {
    return props.data.kind === 'element' ? (
        <ElementRenderer {...(props as TreeItemProps<ElementData<TreeItemWithLaneData>>)} />
    ) : props.data.kind === 'lane' ? (
        <LaneRenderer {...(props as TreeItemProps<LaneData<TreeItemWithLaneData>>)} />
    ) : (
        <MarkerRenderer {...(props as TreeItemProps<MarkerData<TreeItemWithLaneData>>)} />
    );
};
