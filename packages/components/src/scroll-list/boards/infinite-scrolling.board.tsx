import { createBoard } from '@wixc3/react-board';
import { sleep } from 'promise-assist';
import React, { useCallback, useState } from 'react';
import type { ScrollListLoadingState } from '../hooks/use-scroll-list-maybe-load-more';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import { mixinProjectThemes } from '../../board-mixins/mixin-project-themes';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../board-mixins/scenario';
import { ScrollList } from '../scroll-list';

export default createBoard({
    name: 'ScrollList — infinite scroll',
    Board: () => {
        const [items, updateItems] = useState(createItems());
        const [loadingState, updateLoadingState] = useState<ScrollListLoadingState>('idle');
        const loadMore = useCallback(
            async (count: number) => {
                updateLoadingState('loading');
                await sleep(500);
                updateItems(items.concat(createItems(count, items.length)));
                updateLoadingState('idle');
            },
            [items]
        );

        return (
            <ScrollList
                ItemRenderer={ItemRenderer}
                items={items}
                getId={getId}
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
