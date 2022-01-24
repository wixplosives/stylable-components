import type { ItemData } from './item-renderer';

export const createItems = (startIdx = 0, count = 100) =>
    new Array(count).fill(0).map(
        (_, idx) =>
            ({
                id: 'a' + (idx + startIdx),
                title: 'item number ' + (idx + startIdx),
            } as ItemData)
    );
