import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { IconSimulator } from './icon-simulator';

export default createDemo({
    name: 'IconSimulator',
    demo: () => <IconSimulator />,
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 797,
        canvasHeight: 2250,
    },
});
