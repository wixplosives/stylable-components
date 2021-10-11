import { createSimulation } from '@wixc3/wcs-core';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';

export default createSimulation({
    name: 'Button',
    componentType: Button,
    props: {
        children: 'Hello',
    },
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 264,
        canvasHeight: 237
    }
});
