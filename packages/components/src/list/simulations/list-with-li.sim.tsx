import { createSimulation } from '@wixc3/wcs-core';
import { List } from '../list';

import { LIItemRenderer } from '../../simulation-assets/li-item-renderer';
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
    ItemRenderer: LIItemRenderer,
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
