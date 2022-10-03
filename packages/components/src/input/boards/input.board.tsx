import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { projectThemesPlugin } from '../../board-plugins';
import { Input } from '../input';

export default createBoard({
    name: 'Input',
    Board: () => <Input />,
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
