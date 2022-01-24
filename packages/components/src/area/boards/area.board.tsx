import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { Area } from '../area';
import { AddFileIcon } from '../../icons';
export default createBoard({
    name: 'Area',
    Board: () => (
        <Area>
            <AddFileIcon key="a" />
            Hello
        </Area>
    ),
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
