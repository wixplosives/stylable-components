module.exports = {
    safeMode: {
        maxInstancesPerComponent: 10000,
    },
    newComponent: {
        componentsPath: 'packages/components/src',
        templatesPath: 'packages/components/src/component-templates',
    },
    fileNamingConvention: 'pascal-case',
    scripts: {
        install: {
            title: 'Yarn (Install)', // optional
            description: 'Installs the required dependencies', // optional
            command: 'yarn',
            trigger: ['checkout', 'pull', 'setup'],
        },
    },
};
