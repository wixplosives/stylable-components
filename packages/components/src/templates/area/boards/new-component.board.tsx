import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../../board-mixins/mixin-project-themes';
import { NewComponent } from '../new-component';
import { AddFileIcon } from '../../../icons';
import React from 'react';
export default createBoard({
    name: 'new-component',
    Board: () => (
        <NewComponent>
            <AddFileIcon key="a" />
            Hello
        </NewComponent>
    ),
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
