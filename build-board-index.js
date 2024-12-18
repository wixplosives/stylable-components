import { writeFileSync } from 'node:fs';
import { join, parse, relative, basename, extname } from 'node:path';
import { globSync } from 'glob';

const srcPath = join(import.meta.dirname, 'packages/components/src');
const boardIndexPath = join(srcPath, 'board-index.ts');
const boardPaths = globSync('**/*.board.tsx');
const nameCounters = {};
const imports = [];

for (const boardPath of boardPaths) {
    const parsedBoardPath = parse(boardPath);
    const relativePath = relative(srcPath, boardPath);
    const relativeSpecifier = `./${relativePath.replace(/\\/g, '/')}`.slice(0, -parsedBoardPath.ext.length) + '.js';
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

imports.sort((a, b) => a.statement.localeCompare(b.statement));

const boardIndexSource = `/**
 * This file is auto generated when the project is built
 * to rebuild only the file 'npm run build:boards'
 * generated at 'build-board-index.js'
 * do no edit manually
 */
${imports.map((i) => i.statement).join('\n')}

export default [
${imports.map((i) => `    ${i.export},`).join('\n')}
];
`;

writeFileSync(boardIndexPath, boardIndexSource);
