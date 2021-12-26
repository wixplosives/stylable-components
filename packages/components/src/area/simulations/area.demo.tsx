import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Area } from '../area';
import { AddFileIcon } from '../../icons';
import React from 'react';
export default createDemo({
    name: 'Area',
    demo: () => (
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
