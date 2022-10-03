import { createPlugin } from '@wixc3/board-core';
import type { IReactBoard } from '@wixc3/react-board';
import React, { useCallback, useEffect, useState } from 'react';
import { renderInPluginControls } from '../plugin-controls/plugin-controls';
import { classes } from './theme-plugin.st.css';

export interface ThemeItem {
    themeClass: string;
    themeTitle: string;
}

export interface ThemeProps {
    themes: ThemeItem[];
}

export const ThemeControls = ({ themes }: ThemeProps) => {
    const [currentValue, updateValue] = useState(themes[0]?.themeClass || '');
    useEffect(() => {
        const firstTheme = themes[0];
        if (firstTheme) {
            document.body.setAttribute('class', firstTheme.themeClass);
        }
    }, [themes]);
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

export const themePlugin = createPlugin<IReactBoard>()(
    'theme',
    {
        themes: [],
    } as ThemeProps,
    {
        wrapRender({ themes }, _r, board) {
            return renderInPluginControls(
                board,
                <ThemeControls key="theme-controls" themes={themes} />,
                'theme-controls'
            );
        },
    }
);
