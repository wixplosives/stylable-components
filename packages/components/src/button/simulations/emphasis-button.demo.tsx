import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../variants.st.css';

export default createDemo({
    name: 'emphasis button',
    demo: () => <Button className={classes.emphasis}>Hello</Button>,
    plugins: [mixinProjectThemes],
});
