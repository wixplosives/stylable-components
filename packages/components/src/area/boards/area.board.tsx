import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins/index.js';
import { AddFileIcon } from '../../icons/index.js';
import { Area } from '../area.js';

export default createBoard({
    name: 'Area',
    Board: () => (
        <Area>
            <AddFileIcon key="a" />
            Hello
        </Area>
    ),
    plugins: [projectThemesPlugin],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
