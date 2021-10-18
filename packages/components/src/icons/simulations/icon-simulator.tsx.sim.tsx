import { createSimulation } from '@wixc3/wcs-core';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { IconSimulator } from './icon-simulator';

export default createSimulation({
    name: 'IconSimulator',
    componentType: IconSimulator,
    props: {},
    plugins: [mixinProjectThemes],
});
