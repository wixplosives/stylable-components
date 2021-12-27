import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Input } from '../input';

export default createDemo({
    name: 'Input',
    demo: () => <Input />,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
