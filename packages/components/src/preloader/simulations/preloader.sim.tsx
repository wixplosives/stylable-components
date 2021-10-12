import { createSimulation } from '@wixc3/wcs-core';
import { Preloader } from '../preloader';
import { classes } from '../variants/circle-preloader.st.css';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';

export default createSimulation({
  name: 'circle-preloader',
  componentType: Preloader,
  props: {
    className: classes.root,
    children: 'Loading',
  },
  environmentProps: {
    canvasWidth: 298,
    canvasHeight: 422,
    windowWidth: 300,
    windowHeight: 300,
    windowBackgroundColor: '#190101',
  },
  plugins: [mixinProjectThemes],
});
