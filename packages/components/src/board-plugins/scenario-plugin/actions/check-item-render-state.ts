import { expect } from 'chai';
import { Action, expectElement } from '../scenario-plugin.js';

export const checkItemRenderState = (id: string): Action =>
    expectElement(`[data-id='${id}']`, (element) => expect(element).to.exist, `Element [data-id='${id}'] is rendered`);
