import React from 'react';
import type { TreeItemProps } from '../tree/tree';
import { SearchableText } from '../searchable-text/searchable-text';
import { classes, st, vars } from './tree-item-renderer.st.css';
import { ChevronRightWixUiIcon } from '../icons/wix-ui/chevron-right';

export interface TreeItemData {
    title: string;
    id: string;
    children?: TreeItemData[];
}

export const TreeItemRenderer: React.FC<TreeItemProps<TreeItemData>> = (props) => {
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
};
