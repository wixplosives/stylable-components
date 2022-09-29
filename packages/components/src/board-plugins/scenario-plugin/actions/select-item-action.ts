import ReactTestUtils from 'react-dom/test-utils';
import { Action, waitForElement } from '../scenario-plugin';

export const selectItemInput = 'input';
export const selectItemButton = 'button';

export const selectItemAction = (index: string): Action => {
    const timeout = 1_000;
    const title = `Select element with index #${index}`;

    return {
        title,
        execute: async () => {
            const input = await waitForElement(`#${selectItemInput}`, title, timeout);
            if (input && input instanceof HTMLInputElement) {
                input.value = index;
                ReactTestUtils.Simulate.change(input, {
                    target: input,
                });
            }
            const button = await waitForElement(`#${selectItemButton}`, title, timeout);

            if (button && button instanceof HTMLButtonElement) {
                button.click();
            }
        },
        timeout: timeout * 2,
    };
};
