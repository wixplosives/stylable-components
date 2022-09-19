import { Root } from '@zeejs/react';
import { createPlugin } from '@wixc3/board-core';
import type { IReactBoard } from '@wixc3/react-board';
import React from 'react';

export interface ThemeItem {
    themeClass: string;
    themeTitle: string;
}
export const ZeeRoot = createPlugin<IReactBoard>()(
    'ZeeRoot',
    {},
    {
        wrapRender: (_1, _2, el) => {
            return <Root>{el}</Root>;
        },
    }
).use({});
