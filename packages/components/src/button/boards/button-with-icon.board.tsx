import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins';
import { AddFileIcon } from '../../icons';
import { Button } from '../button';

export default createBoard({
    name: 'button-with-icon',
    Board: () => (
        <Button>
            <AddFileIcon key="icon" />
            <span key="text">Click Me!</span>
        </Button>
    ),
    plugins: [projectThemesPlugin],
    environmentProps: {
        windowBackgroundColor: '#fff',
        canvasWidth: 361,
        canvasHeight: 305,
    },
});
