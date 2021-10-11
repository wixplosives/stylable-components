import { createSimulation } from '@wixc3/wcs-core';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';

const createItems = (startIdx = 0) =>
  new Array(1000).fill(0).map(
    (_, idx) =>
      ({
        id: 'a' + (idx + startIdx),
        title: 'item number ' + (idx + startIdx),
      } as ItemData)
  );
const items = createItems(0);

const oneThusandMore = () => {
  items.push(...createItems(items.length));
};

export default createSimulation<ScrollList<ItemData, HTMLElement>>({
  name: 'scroll-list-add-more',
  componentType: ScrollList,
  props: {
    ItemRenderer,
    items,
    getId: (item: ItemData) => item.id,
    loadMore: oneThusandMore,
  },
  environmentProps: {
    canvasWidth: 560,
    windowHeight: 300,
    windowWidth: 500,
  },
  plugins: [
    scenarioMixin.use({
      events: [hoverAction('[data-id="a8"]'), clickAction('[data-id="a8"]'), scrollAction(-1), scrollAction(0)],
    }),
  ],
});
