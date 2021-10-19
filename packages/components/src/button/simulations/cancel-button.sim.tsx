import { createSimulation } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../variants.st.css';

export default createSimulation({
    name: 'Cancel Button',
    componentType: Button,
    props: {
        children: 'Hello',
        className: classes.cancel,
    },
    plugins: [mixinProjectThemes],
});
