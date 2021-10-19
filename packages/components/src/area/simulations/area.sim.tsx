import { createSimulation } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Area } from '../area';
import { AddFileIcon } from '../../icons';
import React from 'react';
export default createSimulation({
    name: 'Area',
    componentType: Area,
    props: {
        children: [<AddFileIcon key="a" />, 'Hello'],
    },
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237,
    },
});
