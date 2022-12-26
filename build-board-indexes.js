const glob = require('glob');
const path = require('path');
const fs = require('fs');
glob('**/*.board.tsx', (error, boards) => {
    if (error) {
        // eslint-disable-next-line no-console
        console.error(error);
    }

    const nameCounters = {};
    const imports = boards.map((board) => {
        const boardWithNoExt = board.slice(0, board.lastIndexOf('.'));

        const splitPath = boardWithNoExt.split('/');
        const relativePath = './' + path.posix.relative('/packages/components/src', '/' + boardWithNoExt);
        const name = splitPath[splitPath.length - 1];
        const nameNoExt = name.slice(0, name.indexOf('.'));
        const escaped = nameNoExt.replace(/-/g, '_');
        const finalName = nameCounters[escaped] ? `${name}${nameCounters[escaped]}` : `${escaped}`;
        if (!nameCounters[name]) {
            nameCounters[name] = 1;
        } else {
            nameCounters[name]++;
        }
        const importStatement = `import ${finalName} from '${relativePath}';\n`;

        return {
            statement: importStatement,
            export: finalName,
        };
    });
    const boardIndexSource = `/**
 * this file is auto generated when the project is built
 * to rebuild only the file 'yarn build:boards'
 * generated at 'build-board-indexes.js'
 * do no edit manually
 */
${imports.map((i) => i.statement).join('')}
export default [
    ${imports.map((i) => i.export).join(',\n    ')}
];
`;

    fs.writeFileSync(path.posix.join(__dirname, './packages/components/src/board-index.ts'), boardIndexSource);
});
