import { createSimulation } from '@wixc3/wcs-core';
import { List } from '../list/list';
import { exampleListItem, ItemData } from './example-list-item';

export default createSimulation({
  componentType: List as List<ItemData>,
  name: 'list example',
  props: {
    ItemRenderer: exampleListItem,
    items: [
      {
        id: 'a',
        title: 'adasd',
      },
    ] as ItemData[],
  },
});
