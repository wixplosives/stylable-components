import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Area } from '../area';
import { AddFileIcon } from '../../icons';
import React from 'react';
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
