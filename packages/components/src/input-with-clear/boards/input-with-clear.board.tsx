import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins';
import { InputWithClear } from '../input-with-clear';

export default createBoard({
    name: 'InputWithClear',
    Board: () => <InputWithClear />,
    plugins: [projectThemesPlugin],
});
