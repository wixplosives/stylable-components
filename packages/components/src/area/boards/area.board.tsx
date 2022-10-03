import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins';
import { AddFileIcon } from '../../icons';
import { Area } from '../area';

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
