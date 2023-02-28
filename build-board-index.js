const { writeFileSync } = require('node:fs');
const { join, parse, relative, basename, extname } = require('node:path');
const { globSync } = require('glob');

const srcPath = join(__dirname, 'packages/components/src');
const boardIndexPath = join(srcPath, 'board-index.ts');
const boardPaths = globSync('**/*.board.tsx');
const nameCounters = {};
const imports = [];

for (const boardPath of boardPaths) {
    const parsedBoardPath = parse(boardPath);
    const relativePath = relative(srcPath, boardPath);
    const relativeSpecifier = `./${relativePath.replace(/\\/g, '/')}`.slice(0, -parsedBoardPath.ext.length);
    const nameWithoutDotBoard = basename(parsedBoardPath.name, extname(parsedBoardPath.name));
    const escapedName = nameWithoutDotBoard.replace(/-/g, '_');
    const localName = nameCounters[escapedName] ? `${escapedName}${nameCounters[escapedName]}` : escapedName;
    nameCounters[escapedName] ??= 0;
    nameCounters[escapedName]++;
    const importStatement = `import ${localName} from '${relativeSpecifier}';`;

    imports.push({
        statement: importStatement,
        export: localName,
    });
}

const boardIndexSource = `/**
 * This file is auto generated when the project is built
 * to rebuild only the file 'yarn build:boards'
 * generated at 'build-board-index.js'
 * do no edit manually
 */
${imports.map((i) => i.statement).join('\n')}

export default [
${imports.map((i) => `    ${i.export},`).join('\n')}
];
`;

writeFileSync(boardIndexPath, boardIndexSource);
