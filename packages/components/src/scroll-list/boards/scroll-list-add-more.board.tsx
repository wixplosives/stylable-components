import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { useCallback, useState } from 'react';
import { ItemData, ItemRenderer } from '../../board-assets/item-renderer';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../board-mixins/scenario';
import { ScrollList, ScrollListLoadingState } from '../scroll-list';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { sleep } from 'promise-assist';
import { createItems } from '../../board-assets/create-items';

export default createBoard({
    name: 'scroll-list-add-more',
    Board: () => {
        const [items, updateItems] = useState(createItems(0));
        const [loadingState, updateLoadingState] = useState<ScrollListLoadingState>('idle');
        const loadMore = useCallback(
            async (count: number) => {
                updateLoadingState('loading');
                await sleep(500);
                updateItems(items.concat(createItems(items.length, count)));
                updateLoadingState('idle');
            },
            [items]
        );
        return (
            <ScrollList
                loadMore={loadMore}
                items={items}
                loadingState={loadingState}
                ItemRenderer={ItemRenderer}
                getId={(item: ItemData) => item.id}
                itemCount={-1}
                watchScrollWindoSize={true}
            />
        );
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 552,
        windowWidth: 744,
    },
    plugins: [
        scenarioMixin.use({
            events: [hoverAction('[data-id="a8"]'), clickAction('[data-id="a8"]'), scrollAction(-1), scrollAction(0)],
        }),
        mixinProjectThemes,
    ],
});
