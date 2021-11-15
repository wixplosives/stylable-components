import { themeMixin, ThemeControls } from './theme-mixin';
import { classes as white } from '../themes/white.st.css';
import { classes as black } from '../themes/black.st.css';
import React from 'react';

export const ProjectThemeControls = (
    <ThemeControls
        key="ThemeControls"
        themes={[
            {
                themeTitle: 'White',
                themeClass: white.white!,
            },
            {
                themeTitle: 'Black',
                themeClass: black.black!,
            },
        ]}
    />
);

export const mixinProjectThemes = themeMixin.use({
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
});
