import { expect } from 'chai';
import { Action, expectElement } from '../scenario-plugin';

export const checkItemVisibility = (id: string, text: string): Action =>
    expectElement(
        `[data-id='${id}']`,
        (el) => expect(el.textContent?.includes(text)),
        `item [data-id='${id}'] is visible`
    );
