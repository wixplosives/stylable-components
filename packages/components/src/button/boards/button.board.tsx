import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { Button } from '../button';

export default createBoard({
    name: 'Button',
    Board: () => <Button>click here</Button>,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 188,
        canvasHeight: 237,
    },
});
