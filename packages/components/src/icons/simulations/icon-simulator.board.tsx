import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { IconSimulator } from './icon-simulator';

export default createBoard({
    name: 'IconSimulator',
    Board: () => <IconSimulator />,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 797,
        canvasHeight: 2250,
    },
});
