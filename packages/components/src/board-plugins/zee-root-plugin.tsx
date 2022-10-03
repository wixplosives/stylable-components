import { createPlugin } from '@wixc3/board-core';
import type { IReactBoard } from '@wixc3/react-board';
import { Root } from '@zeejs/react';
import React from 'react';

export const zeeRootPlugin = createPlugin<IReactBoard>()(
    'zeeRoot',
    {},
    {
        wrapRender: (_1, _2, el) => {
            return <Root>{el}</Root>;
        },
    }
).use({});
