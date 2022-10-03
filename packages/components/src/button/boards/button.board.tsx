import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins';
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
