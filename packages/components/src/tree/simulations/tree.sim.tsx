import { createSimulation } from '@wixc3/wcs-core';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Tree } from '../tree';



export default createSimulation<Tree<ItemData>>({
  name: 'Tree',
  componentType: Tree,
  props: {
    ItemRenderer,
    data: {
      id: 'a',
      title: 'item number ',
    },
    getId: (item: ItemData) => item.id,
    getChildren: () => [],
  },
  plugins: [mixinProjectThemes],
  environmentProps: {
    canvasWidth: 264,
    canvasHeight: 237,
  },
});
