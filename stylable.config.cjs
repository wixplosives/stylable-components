// @ts-check

const { stcConfig } = require('@stylable/cli');

exports.stcConfig = stcConfig({
    options: {
        srcDir: './src',
        outDir: './dist',
        outputSources: true,
        cjs: false,
        useNamespaceReference: true,
    },
    projects: ['packages/*'],
});

exports.defaultConfig = () => {
    return {
        experimentalSelectorInference: true,
    };
};
