import React from 'react';
import type { ListItemProps } from '../list/list';
import type { ItemData } from './';
import { classes, st } from './item-renderer.st.css';

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
