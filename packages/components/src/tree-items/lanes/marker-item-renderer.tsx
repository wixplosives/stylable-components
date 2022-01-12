import React from 'react';
import { ChevronRightWixUiIcon } from '../../icons';
import { SearchableText } from '../../searchable-text/searchable-text';
import type { TreeItemProps } from '../../tree/tree';
import { st, classes, vars } from './marker-item-renderer.st.css';

export interface MarkerData<TREEITEMS> {
    kind: 'marker';
    title: string;
    id: string;
    children?: TREEITEMS[];
}
export function MarkerRenderer<TREEITEMS>(props: TreeItemProps<MarkerData<TREEITEMS>>) {
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

            <SearchableText className={classes.text} text={props.data.title} />
        </div>
    );
}
