import React from 'react';
import { ChevronRightWixUiIcon } from '../../icons';
import { SearchableText } from '../../searchable-text/searchable-text';
import type { TreeItemProps } from '../../tree/tree';
import { st, classes, vars } from './lane-item-renderer.st.css';
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
export function LaneRenderer<TREEITEMS>(props: TreeItemProps<LaneData<TREEITEMS>>) {
    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
                open: props.isOpen,
            })}
            style={
                {
                    [vars.indent!]: props.indent.toString(),
                } as React.CSSProperties
            }
            data-id={props.id}
        >
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
        </div>
    );
}
