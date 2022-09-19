import React from 'react';
import type { ListItemProps } from '../list/list';
import { SearchableText } from '../searchable-text/searchable-text';
import type { ItemData } from './index';
import { classes, st } from './item-renderer.st.css';

export const ItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
            })}
            data-id={props.id}
        >
            <SearchableText className={classes.text} text={props.data.title} />
        </div>
    );
};
