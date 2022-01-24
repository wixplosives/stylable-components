import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { IconSimulator } from './icon-simulator';

export default createBoard({
    name: 'IconSimulator',
    Board: () => <IconSimulator />,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 797,
    },
});
