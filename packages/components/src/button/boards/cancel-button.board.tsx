import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { projectThemesPlugin } from '../../board-plugins';
import { Button } from '../button';
import { classes } from '../variants.st.css';

export default createBoard({
    name: 'Cancel Button',
    Board: () => <Button className={classes.cancel}>Hello</Button>,
    plugins: [projectThemesPlugin],
});
