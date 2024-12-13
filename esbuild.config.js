// @ts-check

import { stylablePlugin } from '@stylable/esbuild';

/** @type {import('esbuild').BuildOptions} */
export default {
    plugins: [stylablePlugin({ cssInjection: 'js' })],
};
