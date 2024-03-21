// @ts-check

const { stylablePlugin } = require('@stylable/esbuild');

/** @type {import('esbuild').BuildOptions} */
module.exports = {
    plugins: [stylablePlugin({ cssInjection: 'js' })],
};
