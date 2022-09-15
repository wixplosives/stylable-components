export interface ItemData {
    title: string;
    id: string;
}

/**
 * Used to generate a list of items for scroll list testing purposes.
 * @param {number} number — number of items to generate;
 * @param {number} startingId — from which id to start; used for infinite scroll testing;
 */
export const createItems = (number = 1000, startingId = 0) =>
    new Array(number).fill(0).map(
        (_, id) =>
            ({
                id: 'a' + (id + startingId),
                title: 'item number ' + (id + startingId),
            } as ItemData)
    );
