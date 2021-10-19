import React from 'react';
import type { ListItemProps } from '../list/list';
import { SearchableText } from '../searchable-text/searchable-text';
import { classes, st } from './item-renderer.st.css';
import { AddFileIcon } from '../icons/add-file';
export interface ItemData {
    title: string;
    id: string;
}

export const ItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
            })}
            data-id={props.id}
        >
            <AddFileIcon />
            <SearchableText className={classes.text} text={props.data.title} />
        </div>
    );
};
