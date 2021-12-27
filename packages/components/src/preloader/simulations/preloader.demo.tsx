import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { Preloader } from '../preloader';
import { classes } from '../variants/circle-preloader.st.css';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';

export default createDemo({
    name: 'circle-preloader',
    demo: () => <Preloader className={classes.root}>Loading</Preloader>,
    environmentProps: {
        canvasWidth: 298,
        canvasHeight: 422,
        windowWidth: 300,
        windowHeight: 300,
        windowBackgroundColor: '#190101',
    },
    plugins: [mixinProjectThemes],
});
