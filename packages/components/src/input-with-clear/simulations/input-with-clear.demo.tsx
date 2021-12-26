import React from 'react';
import { createDemo } from '@wixc3/react-simulation';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { InputWithClear } from '../input-with-clear';

export default createDemo({
    name: 'InputWithClear',
    demo: () => <InputWithClear />,
    plugins: [mixinProjectThemes],
});
