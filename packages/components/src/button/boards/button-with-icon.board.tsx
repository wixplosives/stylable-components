import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { projectThemesPlugin } from '../../board-plugins';
import { Button } from '../button';
import { classes } from '../../common/common.st.css';
import { AddFileIcon } from '../../icons';
export default createBoard({
    name: 'button-with-icon',
    Board: () => (
        <Button>
            <AddFileIcon key="icon" className={classes.icon} />
            <span key="text">Click Me!</span>
        </Button>
    ),
    plugins: [projectThemesPlugin],
    environmentProps: {
        windowBackgroundColor: '#ffffff',
        canvasWidth: 361,
        canvasHeight: 305,
    },
});
