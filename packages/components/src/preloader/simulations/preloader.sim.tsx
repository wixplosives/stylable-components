import { createSimulation } from '@wixc3/wcs-core';
import { themeMixin } from '../../simulation-mixins/theme-mixin';
import { Preloader } from '../preloader';
import { classes } from '../variants/circle-preloader.st.css';
import { classes as white } from '../../themes/white.st.css';
import { classes as black } from '../../themes/black.st.css';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../simulation-mixins/scenario';

export default createSimulation({
    name: 'circle-preloader',
    componentType: Preloader,
    props: {
        className: classes.root,
        children: 'Loading',
    },
    environmentProps: {
        canvasWidth: 298,
        canvasHeight: 422,
        windowWidth: 300,
        windowHeight: 300,
        windowBackgroundColor: '#190101'
    },
    plugins: [
        scenarioMixin.use({
            events: [
                hoverAction('[data-id="a8"]'),
                hoverAction('[data-id="a9"]'),
                clickAction('[data-id="a9"]'),
                clickAction('[data-id="a11"]'),
                scrollAction(-1),
                scrollAction(0),
            ],
        }),
        themeMixin.use({
            themes: [
                {
                    themeTitle: 'White',
                    themeClass: white.white!,
                },
                {
                    themeTitle: 'Black',
                    themeClass: black.black!,
                },
            ],
        }),
    ],
});
