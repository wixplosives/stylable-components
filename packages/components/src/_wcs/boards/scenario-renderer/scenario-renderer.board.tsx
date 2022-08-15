import React, { useReducer } from 'react';
import { createBoard } from '@wixc3/react-board';
import { ScenarioRenderer } from './../../../simulation-mixins/scenario';

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
                    },
                    {
                        title: 'expect something',
                        execute: noop,
                    },
                ]}
            />
        );
    },
    environmentProps: {
        canvasWidth: 194,
    },
});
