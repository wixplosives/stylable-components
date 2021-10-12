import { Root } from '@zeejs/react';

import { createPlugin } from '@wixc3/simulation-core';
import type { IReactSimulation } from '@wixc3/react-simulation';
import React from 'react';

export interface ThemeItem {
  themeClass: string;
  themeTitle: string;
}
export const ZeeRoot = createPlugin<IReactSimulation>()(
  'ZeeRoot',
  {},
  {
    wrapRender: (_1, _2, el) => {
      return <Root>{el}</Root>;
    },
  }
).use({});
