import React from 'react';
import type { ListItemProps } from '../../../src';
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
      <span className={classes.text}>{props.data.title}</span>
    </div>
  );
};
