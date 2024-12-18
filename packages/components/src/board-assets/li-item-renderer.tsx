import React from 'react';
import type { ListItemProps } from '../list/list.js';
import type { ItemData } from './index.js';
import { classes, st } from './item-renderer/item-renderer.st.css';

export const LIItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    return (
        <li
            className={st(classes.root, {
                selected: props.isSelected,
                focused: props.isFocused,
            })}
            data-id={props.id}
        >
            <span className={classes.text}>{props.data.title}</span>
        </li>
    );
};
