import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins/index.js';
import { InputWithClear } from '../input-with-clear.js';

export default createBoard({
    name: 'InputWithClear',
    Board: () => <InputWithClear />,
    plugins: [projectThemesPlugin],
});
