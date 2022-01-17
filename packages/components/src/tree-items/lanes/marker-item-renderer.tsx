import React, { useContext } from 'react';
import { SearchableText } from '../../searchable-text/searchable-text';
import type { TreeItemInfo, TreeItemProps } from '../../tree/tree';
import { lanesContext } from './lane-context';
import { st, classes, vars } from './marker-item-renderer.st.css';

export interface MarkerData<TREEITEMS> {
    kind: 'marker';
    title: string;
    id: string;
    children?: TREEITEMS[];
}

export function MarkerRenderer<TREEITEMS>(props: TreeItemProps<MarkerData<TREEITEMS>>) {
    const laneCtx = useContext(lanesContext);
    const indent = laneCtx.getIndent(props.data as MarkerData<any>);

    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
                open: props.isOpen,
                empty: !props.hasChildren,
            })}
            style={
                {
                    [vars.indent!]: indent.toString(),
                } as React.CSSProperties
            }
            data-id={props.id}
        >
            <SearchableText className={classes.text} text={props.data.title} />
            {!props.hasChildren ? <div className={classes.emptyContent}>Drag Element Here</div> : null}
        </div>
    );
}
export const calcMarkerSize = function <TREEITEMS>(item: TreeItemInfo<MarkerData<TREEITEMS>>) {
    if (item.hasChildren) {
        return 17;
    }
    return 38;
};
