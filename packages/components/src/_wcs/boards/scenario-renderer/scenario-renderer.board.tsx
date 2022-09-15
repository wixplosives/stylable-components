import React, { useReducer } from 'react';
import { createBoard } from '@wixc3/react-board';
import { ScenarioRenderer } from '../../../board-mixins/scenario';

const noop = () => undefined;

export default createBoard({
    name: 'ScenarioRenderer',
    Board: () => {
        const [key, resetBoard] = useReducer((n: number) => n + 1, 0);
        return (
            <ScenarioRenderer
                key={key}
                title="should look decent"
                resetBoard={resetBoard}
                events={[
                    {
                        title: 'click something',
                        execute: noop,
                        timeout: 2000,
                    },
                    {
                        title: 'expect something',
                        execute: noop,
                        timeout: 2000,
                    },
                ]}
            />
        );
    },
    environmentProps: {
        canvasWidth: 194,
    },
});
