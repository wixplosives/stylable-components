import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { InputWithClear } from '../input-with-clear';

export default createBoard({
    name: 'InputWithClear',
    Board: () => <InputWithClear />,
    plugins: [mixinProjectThemes],
});
