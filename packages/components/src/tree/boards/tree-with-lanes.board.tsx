import { createBoard } from '@wixc3/react-board';
import React, { useMemo, useState } from 'react';
import { getChildren } from '../../board-assets';
import { projectThemesPlugin } from '../../board-plugins';
import type { ElementData } from '../../board-assets/tree-items/lanes/element-item-renderer';
import { lanesContext } from '../../board-assets/tree-items/lanes/lane-context';
import type { LaneData, LaneItem } from '../../board-assets/tree-items/lanes/lane-item-renderer';
import type { MarkerData } from '../../board-assets/tree-items/lanes/marker-item-renderer';
import { OverlayRenderer } from '../../board-assets/tree-items/lanes/overlays-renderer';
import {
    calcItemSize,
    TreeItemWithLaneData,
    TreeItemWithLaneRenderer,
} from '../../board-assets/tree-items/tree-item-with-lane-renderer';
import { createTreeOverlay, Tree } from '../tree';

let idCounter = 0;
const nextId = () => 'id' + idCounter++;

const el = (tagName: string, children?: TreeItemWithLaneData[]): ElementData<TreeItemWithLaneData> => ({
    id: nextId(),
    kind: 'element',
    tagName,
    children,
});

const laneKinds = {
    repeater: {
        title: 'repeater',
        color: 'blue',
    },
    expression: {
        title: 'expression',
        color: 'orange',
    },
};

const lane = (items: LaneItem[], children?: TreeItemWithLaneData[]): LaneData<TreeItemWithLaneData> => ({
    id: nextId(),
    kind: 'lane',
    items,
    children,
});

const marker = (title: string, children?: TreeItemWithLaneData[]): MarkerData<TreeItemWithLaneData> => ({
    id: nextId(),
    kind: 'marker',
    title,
    children,
});

const mockedLane = lane(
    [laneKinds.repeater, laneKinds.expression],
    [
        el('span', [
            el('Comp', [marker('children'), marker('header', [el('div')])]),
            el('div', [
                el('p', [
                    lane(
                        [laneKinds.repeater],

                        [
                            el('span'),

                            lane(
                                [laneKinds.repeater, laneKinds.expression],
                                [
                                    lane(
                                        [laneKinds.repeater, laneKinds.expression],
                                        [
                                            el('span', [
                                                el('Comp', [marker('children'), marker('header', [el('div')])]),
                                                el('div', [
                                                    el('p', [
                                                        lane(
                                                            [laneKinds.repeater],

                                                            [
                                                                el('span'),

                                                                lane(
                                                                    [laneKinds.repeater, laneKinds.expression],
                                                                    [
                                                                        lane(
                                                                            [laneKinds.repeater, laneKinds.expression],
                                                                            [
                                                                                el('span', [
                                                                                    el('Comp', [
                                                                                        marker('children'),
                                                                                        marker('header', [el('div')]),
                                                                                    ]),
                                                                                    el('div', [
                                                                                        el('p', [
                                                                                            lane(
                                                                                                [laneKinds.repeater],
                                                                                                [el('span')]
                                                                                            ),
                                                                                        ]),
                                                                                    ]),
                                                                                ]),
                                                                            ]
                                                                        ),
                                                                        el('span', [
                                                                            el('Comp', [
                                                                                marker('children'),
                                                                                marker('header', [el('div')]),
                                                                            ]),
                                                                            el('div', [
                                                                                el('p', [
                                                                                    lane(
                                                                                        [laneKinds.repeater],
                                                                                        [el('span')]
                                                                                    ),
                                                                                ]),
                                                                            ]),
                                                                        ]),
                                                                    ]
                                                                ),
                                                            ]
                                                        ),
                                                    ]),
                                                ]),
                                            ]),
                                        ]
                                    ),
                                    el('span', [
                                        el('Comp', [marker('children'), marker('header', [el('div')])]),
                                        el('div', [el('p', [lane([laneKinds.repeater], [el('span')])])]),
                                    ]),
                                ]
                            ),
                        ]
                    ),
                ]),
            ]),
        ]),
    ]
);

const data: TreeItemWithLaneData = el('div', [mockedLane, mockedLane]);
const getAllIds = (item: TreeItemWithLaneData): string[] =>
    item.children ? [item.id, ...item.children.flatMap((item) => getAllIds(item))] : [item.id];
const allIds = getAllIds(data);
const parentMap = new Map<TreeItemWithLaneData, TreeItemWithLaneData>();
const addToParentMap = (item: TreeItemWithLaneData) => {
    for (const child of item.children || []) {
        parentMap.set(child, item);
        addToParentMap(child);
    }
};
addToParentMap(data);
const getParents = (item: TreeItemWithLaneData) => {
    let parent = parentMap.get(item);
    const parents: TreeItemWithLaneData[] = [];
    while (parent) {
        parents.push(parent);
        parent = parentMap.get(parent);
    }
    return parents;
};
const getIndent = (item: TreeItemWithLaneData) => {
    return getParents(item).reduce((acc, curr) => {
        if (curr.kind === 'element') {
            return acc + 1;
        }
        return acc;
    }, 0);
};
const treeOverlay = createTreeOverlay(OverlayRenderer, {});
export default createBoard({
    name: 'Tree with lanes',
    Board: () => {
        const [selection, updateSelection] = useState<string | undefined>(undefined);
        const [openItems, updateOpen] = useState<string[]>(allIds);

        return (
            <lanesContext.Provider
                value={useMemo(
                    () => ({
                        getIndent,
                        getParents,
                        selectItem: (item) => {
                            updateSelection(item.id);
                        },
                    }),
                    []
                )}
            >
                <Tree
                    ItemRenderer={TreeItemWithLaneRenderer}
                    data={data}
                    getId={(item: TreeItemWithLaneData) => item.id}
                    getChildren={getChildren}
                    scrollOffset={50}
                    openItemsControls={[openItems, updateOpen]}
                    selectionControl={[selection, updateSelection]}
                    itemSize={calcItemSize}
                    scrollListRoot={{
                        props: {
                            style: {
                                width: '100%',
                            },
                        },
                    }}
                    listRoot={{
                        props: {
                            style: {
                                width: '100%',
                            },
                        },
                    }}
                    overlay={treeOverlay}
                />
            </lanesContext.Provider>
        );
    },
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 566,
        windowHeight: 600,
        windowWidth: 1024,
    },
});
