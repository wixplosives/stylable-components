import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { Input } from '../input';

export default createBoard({
    name: 'Input',
    Board: () => <Input />,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
