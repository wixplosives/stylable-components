import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins';
import { Preloader } from '../preloader';
import { classes } from '../variants/circle-preloader.st.css';

export default createBoard({
    name: 'circle-preloader',
    Board: () => <Preloader className={classes.root}>Loading</Preloader>,
    environmentProps: {
        canvasWidth: 298,
        canvasHeight: 422,
        windowWidth: 300,
        windowHeight: 300,
        windowBackgroundColor: '#190101',
    },
    plugins: [projectThemesPlugin],
});
