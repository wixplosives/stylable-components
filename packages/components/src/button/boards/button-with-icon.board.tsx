import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins/index.js';
import { AddFileIcon } from '../../icons/index.js';
import { Button } from '../button.js';

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
