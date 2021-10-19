import React from 'react';
import { createSimulation } from '@wixc3/wcs-core';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../../common/common.st.css';
import {AddFileIcon} from '../../icons';
export default createSimulation({
  name: 'button-with-icon',
  componentType: Button,
  props: {
    children: [
      <AddFileIcon key={'a'}/>,
      <span key="text">Click Me!</span>,
    ],
  },
  plugins: [mixinProjectThemes],
  environmentProps: {
    windowBackgroundColor: '#ffffff',
    canvasWidth: 361,
    canvasHeight: 305,
  },
});
