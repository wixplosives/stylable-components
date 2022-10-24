export const getRenderedIndexes = <T>({
    list,
    items,
    getId,
}: {
    list: HTMLElement | null;
    items: T[];
    getId: (i: T) => string;
}) => {
    if (!list) {
        return { firstIndex: null, lastIndex: null };
    }
    const first = list?.querySelector(`[data-id]:first-child`);
    const last = list?.querySelector(`[data-id]:last-child`);
    const firstId = first?.attributes.getNamedItem('data-id')?.value;
    const lastId = last?.attributes.getNamedItem('data-id')?.value;
    const firstIndex = items.findIndex((i) => getId(i) === firstId);
    const lastIndex = items.findIndex((i) => getId(i) === lastId);

    return { firstIndex, lastIndex };
};
