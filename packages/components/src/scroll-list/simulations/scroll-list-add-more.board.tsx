/* eslint-disable react-hooks/rules-of-hooks */
import { createBoard } from '@wixc3/react-board';
import React, { useCallback, useState } from 'react';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../simulation-mixins/scenario';
import { ScrollList, ScrollListLoadingState } from '../scroll-list';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { sleep } from 'promise-assist';
import { createItems } from '../../simulation-assets/create-items';

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
                ItemRenderer={ItemRenderer}
                items={items}
                getId={(item: ItemData) => item.id}
                itemCount={-1}
                watchScrollWindowSize={true}
                loadMore={loadMore}
                loadingState={loadingState}
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
            title: 'should load more items when reaching end',
            events: [hoverAction('[data-id="a8"]'), clickAction('[data-id="a8"]'), scrollAction(-1), scrollAction(0)],
        }),
        mixinProjectThemes,
    ],
});
