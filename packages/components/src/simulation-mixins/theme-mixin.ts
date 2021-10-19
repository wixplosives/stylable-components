import { createPlugin } from '@wixc3/simulation-core';
import type { IReactSimulation } from '@wixc3/react-simulation';
import { classes } from './theme-mixin.st.css';
import { getMixinControls } from './mixin-controls';

export interface ThemeItem {
    themeClass: string;
    themeTitle: string;
}
const selectId = 'theme-mixin-select';
export const themeMixin = createPlugin<IReactSimulation>()(
    'theme',
    {
        themes: [] as ThemeItem[],
    },
    {
        beforeRender(props) {
            const canvas = getMixinControls();
            const firstTheme = props.themes[0];
            if (firstTheme) {
                document.body.setAttribute('class', firstTheme.themeClass);
            }
            const existing = canvas.querySelector('#' + selectId);
            if (!existing) {
                const div = window.document.createElement('div');

                div.setAttribute('class', classes.root);
                const labelDiv = window.document.createElement('div');

                labelDiv.innerText = 'Themes';
                div.appendChild(labelDiv);
                const select = window.document.createElement('select');
                div.appendChild(select);
                select.setAttribute('class', classes.select!);
                select.setAttribute('id', selectId);
                select.setAttribute('value', props.themes[0]?.themeClass || '');
                for (const theme of props.themes) {
                    const option = window.document.createElement('option');
                    option.setAttribute('id', theme.themeClass);
                    option.innerText = theme.themeTitle;
                    select.appendChild(option);
                }

                select.addEventListener('change', (ev) => {
                    const currValue = (ev.currentTarget as HTMLSelectElement)?.value;
                    const theme = props.themes.find((v) => {
                        return v.themeTitle === currValue;
                    });
                    // console.log(theme);
                    if (theme) {
                        document.body.setAttribute('class', theme.themeClass);
                    }
                });

                canvas.appendChild(div);
            }
        },
    }
);
