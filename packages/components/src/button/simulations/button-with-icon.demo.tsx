import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { Button } from '../button';
import { classes } from '../../common/common.st.css';
import { AddFileIcon } from '../../icons';
export default createDemo({
    name: 'button-with-icon',
    demo: () => (
        <Button>
            <AddFileIcon key="icon" className={classes.icon} />
            <span key="text">Click Me!</span>
        </Button>
    ),
    plugins: [mixinProjectThemes],
    environmentProps: {
        windowBackgroundColor: '#ffffff',
        canvasWidth: 361,
        canvasHeight: 305,
    },
});
