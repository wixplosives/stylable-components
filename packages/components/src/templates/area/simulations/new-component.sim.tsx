import { createSimulation } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../../simulation-mixins/mixin-project-themes';
import { NewComponent } from '../new-component';
import { AddFileIcon } from '../../../icons';
import React from 'react';
export default createSimulation({
    name: 'new-component',
    componentType: NewComponent,
    props: {
        children: [<AddFileIcon key="a" />, 'Hello'],
    },
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
