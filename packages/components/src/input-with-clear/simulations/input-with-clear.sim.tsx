import { createSimulation } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { InputWithClear } from '../input-with-clear';

export default createSimulation({
    name: 'InputWithClear',
    componentType: InputWithClear,
    props: {},
    plugins: [mixinProjectThemes],
});
