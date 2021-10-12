import { createSimulation } from '@wixc3/react-simulation';
import { scenarioMixin, scrollAction } from '../../../simulation-mixins/scenario';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createSimulation({
  componentType: ScrollHookSimulator,
  name: 'use scroll window vertical',
  props: {},
  environmentProps: {
    canvasWidth: 200,
    canvasHeight: 2000,
    windowWidth: 500,
    windowHeight: 640,
  },
  plugins: [
    scenarioMixin.use({
      events: [scrollAction(300), scrollAction(200), scrollAction(-1), scrollAction(0)],
    }),
  ],
});
