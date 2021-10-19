import { createSimulation } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Area } from '../area';

export default createSimulation({
  name: 'Area',
  componentType: Area,
  props: {
    children: 'Hello',
  },
  plugins: [mixinProjectThemes],
  environmentProps: {
    canvasWidth: 264,
    canvasHeight: 237,
  },
});
