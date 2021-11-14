import { themeMixin } from './theme-mixin';
import { classes as white } from '../themes/white.st.css';
import { classes as black } from '../themes/black.st.css';

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
