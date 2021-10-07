import { createSimulation } from '@wixc3/wcs-core';
import { Preloader } from '../preloader';
import { classes } from '../variants/circle-preloader.st.css';

export default createSimulation({
    name: 'circle-preloader',
    componentType: Preloader,
    props: {
        className: classes.root,
        children: 'Loading'
    },
    environmentProps: {
        canvasWidth: 150,
        canvasHeight: 150,
    },
});
