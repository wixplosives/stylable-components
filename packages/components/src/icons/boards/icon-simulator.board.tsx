import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { projectThemesPlugin } from '../../board-plugins';
import { IconSimulator } from './icon-simulator';

export default createBoard({
    name: 'IconSimulator',
    Board: () => <IconSimulator />,
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 797,
        canvasHeight: 2250,
    },
});
