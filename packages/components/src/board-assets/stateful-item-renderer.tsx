import React from 'react';
import type { ListItemProps } from '../list/list.js';
import { classes, st } from './item-renderer/item-renderer.st.css';
import type { ItemData } from './items.js';

export const StatefulItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    return (
        <div
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
            })}
            data-id={props.id}
        >
            <span className={classes.text}>{props.data.title}</span>
            <input></input>
        </div>
    );
};
