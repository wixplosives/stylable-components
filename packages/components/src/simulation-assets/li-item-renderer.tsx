import React from 'react';
import type { ListItemProps } from '../list/list';
import { classes, st } from './item-renderer.st.css';
export interface ItemData {
    title: string;
    id: string;
}

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
