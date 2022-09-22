import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { projectThemesPlugin } from '../../board-plugins/project-themes-plugin';
import { Button } from '../button';

export default createBoard({
    name: 'Button',
    Board: () => <Button>click here</Button>,
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 188,
        canvasHeight: 237,
    },
});
