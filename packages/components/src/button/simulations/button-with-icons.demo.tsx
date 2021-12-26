import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../../common/common.st.css';
export default createDemo({
    name: 'button-with-icons',
    demo: () => (
        <Button>
            <img
                key="img"
                className={classes.icon}
                src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text y='.9em' font-size='90'>🏞</text></svg>"
            />
            <img
                key="img2"
                className={classes.icon}
                src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text y='.9em' font-size='90'>🏞</text></svg>"
            />
            <span key="text">Click Me!</span>,
        </Button>
    ),
    plugins: [mixinProjectThemes],
    environmentProps: {
        windowBackgroundColor: '#ffffff',
        canvasWidth: 361,
        canvasHeight: 305,
    },
});
