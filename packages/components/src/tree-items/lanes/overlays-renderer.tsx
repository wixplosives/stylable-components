import React, { useContext } from 'react';
import type { TreeOverlayProps } from '../../tree/tree';
import type { TreeItemWithLaneData } from '../tree-item-with-lane-renderer';
import { lanesContext } from './lane-context';
import { st, classes, vars } from './overlays-renderer.st.css';



export const OverlayRenderer = (props: TreeOverlayProps<TreeItemWithLaneData>) => {
    const laneCtx = useContext(lanesContext);
    let currPos = 0;
    const lanes = props.shownItems.reduce(
        (acc, item) => {
            const itemSize = (props.itemSizes[item.id] !== undefined ? props.itemSizes[item.id] : props.avgSize) || 0;
            currPos += itemSize;
            if (item.kind !== 'element') {
                acc.set(item, {
                    start: currPos,
                    end: currPos,
                });
            }
            const parents = laneCtx.getParents(item);
            for (const parent of parents) {
                if (parent.kind !== 'element') {
                    acc.set(parent, {
                        start: acc.get(parent)?.start || 0,
                        end: itemSize + (acc.get(parent)?.end || 0),
                    });
                }
            }
            return acc;
        },
        new Map<
            TreeItemWithLaneData,
            {
                start: number;
                end: number;
            }
        >()
    );
    return (
        <div className={classes.root} style={props.style}>
            {[...lanes.entries()].map(([item, { end, start }]) => {
                const indent = laneCtx.getIndent(item);
                const actualIndent = item.kind !== 'element' ? indent - 1 : indent;
                if (item.kind === 'lane') {
                    return (
                        <div
                            className={st(classes.item, { kind: item.kind })}
                            key={item.id}
                            style={{
                                position: 'absolute',
                                top: start + 'px',
                                height: end - start + 'px',
                                [vars.indent!]: actualIndent.toString(),
                                [vars.laneColor!]: item.items[0]!.color,
                            }}
                        />
                    );
                }
                if (!item.children?.length) {
                    return null;
                }
                return (
                    <div
                        className={st(classes.item, { kind: item.kind })}
                        key={item.id}
                        style={{
                            position: 'absolute',
                           
                            top: start - 18 + 'px',
                            height: end - start + 18 + 'px',
                           
                            [vars.indent!]: actualIndent.toString(),
                        }}
                    />
                );
            })}
        </div>
    );
};
