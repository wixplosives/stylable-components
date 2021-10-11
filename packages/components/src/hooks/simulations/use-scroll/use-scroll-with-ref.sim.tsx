import { createSimulation } from '@wixc3/react-simulation';
import { scenarioMixin, scrollAction } from '../../../simulation-mixins/scenario';
import { ScrollHookSimulator } from './scroll-hook-simulator';

export default createSimulation({
  componentType: ScrollHookSimulator,
  name: 'use scroll vertical with ref',
  props: {
    useWindowScroll: false,
  },
  environmentProps: {
    canvasWidth: 200,
    canvasHeight: 500,
    windowWidth: 500,
    windowHeight: 640,
  },
  plugins: [
    scenarioMixin.use({
      events: [
        scrollAction(300, true, '#scroll-div'),
        scrollAction(200, true, '#scroll-div'),
        scrollAction(-1, true, '#scroll-div'),
        scrollAction(0, true, '#scroll-div'),
      ],
    }),
  ],
});
