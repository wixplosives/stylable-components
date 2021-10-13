import React from 'react';
import type { ListItemProps } from '../list/list';
import { SearchableText } from '../searchable-text/searchable-text';
import { classes, st } from './item-renderer.st.css';
export interface ItemData {
    title: string;
    id: string;
}

export const ItemRenderer = (props: ListItemProps<ItemData>) => {
    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
            })}
            data-id={props.id}
        >
            <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text y='.9em' font-size='90'>🏞</text></svg>" className={classes.icon} />
            <SearchableText className={classes.text} text={props.data.title} />
        </div>
    );
};
