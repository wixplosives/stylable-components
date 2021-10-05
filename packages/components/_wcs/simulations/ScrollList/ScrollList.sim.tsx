import { createSimulation } from '@wixc3/wcs-core';
import React from 'react';
import { ItemData, ItemRenderer } from '../common/item-renderer';
import { ScrollList } from './../../../src/scoll-list/scroll-list';

const bodyRef = React.createRef<HTMLElement>();
(bodyRef as any).current = window.document.body;

const items = new Array(1000).fill(0).map(
  (_, idx) =>
    ({
      id: 'a' + idx,
      title: 'item number ' + idx,
    } as ItemData)
);

export default createSimulation<ScrollList<ItemData, HTMLElement>>({
  name: 'ScrollList',
  componentType: ScrollList,
  props: {
    ItemRenderer,
    items,
    scrollWindow: bodyRef,
    getId: (item: ItemData) => item.id,
  },
  environmentProps: {
    canvasWidth: 560,
  },
});
