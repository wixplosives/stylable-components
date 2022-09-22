import { classes as black } from '../themes/black.st.css';
import { classes as white } from '../themes/white.st.css';
import { themePlugin } from './theme-plugin/theme-plugin';

export const projectThemesPlugin = themePlugin.use({
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
