import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../variants.st.css';

export default createBoard({
    name: 'Cancel Button',
    Board: () => <Button className={classes.cancel}>Hello</Button>,
    plugins: [mixinProjectThemes],
});
