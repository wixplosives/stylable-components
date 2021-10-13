import { createSimulation } from '@wixc3/wcs-core';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../variants.st.css';

export default createSimulation({
  name: 'emphasis button',
  componentType: Button,
  props: {
    children: 'Hello',
    className: classes.emphasis,
  },
  plugins: [mixinProjectThemes],
});
