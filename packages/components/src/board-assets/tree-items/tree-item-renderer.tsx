import React from 'react';
import { ChevronRightWixUiIcon } from '../../icons/wix-ui/chevron-right.js';
import { SearchableText } from '../../searchable-text/searchable-text.js';
import type { TreeItemProps } from '../../tree/index.js';
import { classes, st, vars } from '../tree-items/tree-item-renderer.st.css';
import type { TreeItemData } from '../items.js';

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
