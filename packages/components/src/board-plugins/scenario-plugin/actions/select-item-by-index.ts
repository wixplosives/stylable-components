import { fireEvent } from '@testing-library/react';
import { Action, waitForElement } from '../scenario-plugin.js';

export const selectItemInput = 'input';
export const selectItemButton = 'button';

export const selectItemByIndex = (index: string): Action => {
    const title = `Select element with index #${index}`;

    return {
        title,
        execute: async () => {
            const input = await waitForElement(`#${selectItemInput}`, title);
            if (input && input instanceof HTMLInputElement) {
                fireEvent.change(input, { target: { value: index } });
            }
            const button = await waitForElement(`#${selectItemButton}`, title);

            // Needs to happen after ReactTestUtils.Simulate.change would simulate change and board would handle it
            window.setTimeout(() => {
                if (button && button instanceof HTMLButtonElement) {
                    button.click();
                }
            });
        },
        timeout: 2_000,
    };
};
