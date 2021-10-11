import { createSimulation } from '@wixc3/react-simulation';
import { scenarioMixin, scrollAction } from '../../../simulation-mixins/scenario';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createSimulation({
  componentType: ScrollHookSimulator,
  name: 'use scroll window horizontal',
  props: {
    isHorizontal: true,
  },
  environmentProps: {
    canvasWidth: 2000,
    canvasHeight: 500,
    windowWidth: 500,
    windowHeight: 640,
  },
  plugins: [
    scenarioMixin.use({
      events: [scrollAction(300, false), scrollAction(200, false), scrollAction(-1, false), scrollAction(0, false)],
    }),
  ],
});
