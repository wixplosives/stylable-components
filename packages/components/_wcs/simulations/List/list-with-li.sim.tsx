import { createSimulation } from '@wixc3/wcs-core';
import { List } from './../../../src/list/list';
import { classes, st } from './list.sim.st.css';

import React from 'react';
interface ItemData {
  title: string;
  id: string;
}

export default createSimulation<List<ItemData>>({
  name: 'list-with-li',
  componentType: List,
  props: {
    root: {
      el: 'ul',
      props: {},
    },
    ItemRenderer: (item) => {
      return (
        <li
          className={st(classes.item, {
            selected: item.isSelected,
            focused: item.isFocused,
          })}
          data-id={item.id}
        >
          <span className={classes.itemText}>{item.data.title}</span>
        </li>
      );
    },
    items: [
      {
        id: 'a',
        title: 'item 1',
      },
      {
        id: 'b',
        title: 'item 2',
      },
    ] as ItemData[],
    getId: (item: ItemData) => item.id,
  },
  environmentProps: {
    canvasWidth: 331,
  },
});
