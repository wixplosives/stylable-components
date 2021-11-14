import { createPlugin } from '@wixc3/simulation-core';
import type { IReactSimulation } from '@wixc3/react-simulation';
import { classes } from './theme-mixin.st.css';
import React, { useCallback, useState } from 'react';
import { getMixinControls } from './mixin-controls';
import ReactDom from 'react-dom';

export interface ThemeItem {
    themeClass: string;
    themeTitle: string;
}
export interface ThemeProps {
    themes: ThemeItem[];
}

export const ThemeControls = ({ themes }: ThemeProps) => {
    const [currentValue, updateValue] = useState(themes[0]?.themeClass || '');
    const onThemeSelect = useCallback(
        (ev: React.ChangeEvent<HTMLSelectElement>) => {
            const currValue = ev.currentTarget.value;
            const theme = themes.find((v) => {
                return v.themeTitle === currValue;
            });
            // console.log(theme);
            if (theme) {
                document.body.setAttribute('class', theme.themeClass);
            }
            updateValue(currValue);
        },
        [themes]
    );
    return (
        <div className={classes.root}>
            <div>Themes</div>
            <select className={classes.select} value={currentValue} onChange={onThemeSelect}>
                {themes.map((theme) => (
                    <option key={theme.themeClass}>{theme.themeTitle}</option>
                ))}
            </select>
        </div>
    );
};

export const themeMixin = createPlugin<IReactSimulation>()(
    'theme',
    {
        themes: [],
    } as ThemeProps,
    {
        wrapRender({ themes }, _r, demo) {
            const el = getMixinControls();
            const firstTheme = themes[0];
            if (firstTheme) {
                document.body.setAttribute('class', firstTheme.themeClass);
            }
            return (
                <>
                    {demo}
                    {ReactDom.createPortal(
                        <ThemeControls key="theme-controls" themes={themes} />,
                        el,
                        'theme-controls'
                    )}
                </>
            );
        },
    }
);
