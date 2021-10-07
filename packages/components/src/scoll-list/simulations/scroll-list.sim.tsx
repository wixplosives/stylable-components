import { createSimulation } from '@wixc3/wcs-core';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';

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
    getId: (item: ItemData) => item.id,
  },
  environmentProps: {
    canvasWidth: 560,
    windowHeight: 300,
    windowWidth: 500,
  },
  plugins: [
    scenarioMixin.use({
      events: [
        hoverAction('[data-id="a8"]'),
        hoverAction('[data-id="a9"]'),
        clickAction('[data-id="a9"]'),
        clickAction('[data-id="a11"]'),
        scrollAction(-1),
        scrollAction(0),
      ],
    }),
  ],
});
