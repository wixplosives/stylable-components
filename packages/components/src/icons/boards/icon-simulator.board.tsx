import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins/index.js';
import { IconSimulator } from './icon-simulator.js';

export default createBoard({
    name: 'IconSimulator',
    Board: () => <IconSimulator />,
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 797,
        canvasHeight: 2250,
    },
});
