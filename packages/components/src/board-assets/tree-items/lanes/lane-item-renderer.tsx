import React, { useContext } from 'react';
import { ChevronRightWixUiIcon } from '../../../icons';
import { SearchableText } from '../../../searchable-text/searchable-text';
import type { TreeItemInfo, TreeItemProps } from '../../../tree';
import { lanesContext } from '../../tree-items/lanes/lane-context';
import { classes, st, vars } from '../../tree-items/lanes/lane-item-renderer.st.css';

export interface LaneItem {
    title: string;
    color: string;
}

export interface LaneData<TREEITEMS> {
    kind: 'lane';
    id: string;
    items: LaneItem[];
    children?: TREEITEMS[];
}

export interface LaneOverlayProps<TREEITEMS> extends TreeItemProps<LaneData<TREEITEMS>> {
    startsAt: number;
    endsAt: number;
}

export function LaneOverlayRenderer<TREEITEMS>(props: LaneOverlayProps<LaneData<TREEITEMS>>) {
    const laneCtx = useContext(lanesContext);
    const indent = laneCtx.getIndent(props.data as LaneData<any>) - 1;

    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
                open: props.isOpen,
            })}
            style={
                {
                    [vars.indent!]: indent.toString(),
                } as React.CSSProperties
            }
            data-id={props.id}
        >
            {props.isSelected ? (
                <>
                    {props.hasChildren ? (
                        <ChevronRightWixUiIcon
                            className={classes.chevron}
                            onClick={() => {
                                if (props.isOpen) {
                                    props.close();
                                } else {
                                    props.open();
                                }
                            }}
                        ></ChevronRightWixUiIcon>
                    ) : null}

                    <SearchableText className={classes.text} text={props.data.items.map((item) => item.title).join()} />
                </>
            ) : (
                props.data.items.map((item, idx) => (
                    <div
                        className={classes.rect}
                        key={idx}
                        style={{
                            background: item.color,
                        }}
                    ></div>
                ))
            )}
        </div>
    );
}

export const calcLaneSize = function <TREEITEMS>(_item: TreeItemInfo<LaneData<TREEITEMS>>) {
    return 0;
};
