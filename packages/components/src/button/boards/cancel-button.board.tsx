import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins/index.js';
import { Button } from '../button.js';
import { classes } from '../variants.st.css';

export default createBoard({
    name: 'Cancel Button',
    Board: () => <Button className={classes.cancel}>Hello</Button>,
    plugins: [projectThemesPlugin],
});
