import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { ScenarioRenderer } from './../../../simulation-mixins/scenario';

const noop = () => undefined;

export default createBoard({
    name: 'ScenarioRenderer',
    Board: () => (
        <ScenarioRenderer
            title="should look decent"
            resetBoard={noop}
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
    ),
    environmentProps: {
        canvasWidth: 194
    }
});
