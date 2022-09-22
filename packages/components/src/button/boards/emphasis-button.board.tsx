import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { projectThemesPlugin } from '../../board-plugins/project-themes-plugin';
import { Button } from '../button';
import { classes } from '../variants.st.css';

export default createBoard({
    name: 'emphasis button',
    Board: () => <Button className={classes.emphasis}>Hello</Button>,
    plugins: [projectThemesPlugin],
});
