import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';

export default createDemo({
    name: 'Button',
    demo: () => <Button>click here</Button>,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 188,
        canvasHeight: 237,
    },
});
