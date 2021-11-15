import { createSimulation } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { IconSimulator } from './icon-simulator';

export default createSimulation({
    name: 'IconSimulator',
    componentType: IconSimulator,
    props: {},
    plugins: [mixinProjectThemes],
    environmentProps: {
        canvasWidth: 797,
        canvasHeight: 2250
    },
});
