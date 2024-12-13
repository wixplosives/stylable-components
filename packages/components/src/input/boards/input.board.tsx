import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins/index.js';
import { Input } from '../input.js';

export default createBoard({
    name: 'Input',
    Board: () => <Input />,
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
