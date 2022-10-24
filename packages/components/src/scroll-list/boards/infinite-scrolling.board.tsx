import { createBoard } from '@wixc3/react-board';
import { sleep } from 'promise-assist';
import React, { useCallback, useState } from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import { clickAction, hoverAction, projectThemesPlugin, scenarioPlugin, scrollAction } from '../../board-plugins';
import type { ScrollListLoadingState } from '../hooks/use-scroll-list-maybe-load-more';
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
                watchScrollWindowSize={true}
                itemCount={-1}
                loadMore={loadMore}
                loadingState={loadingState}
            />
        );
    },
    environmentProps: {
        windowWidth: 500,
        canvasWidth: 400,
        windowHeight: 500,
    },
    plugins: [
        scenarioPlugin.use({
            title: 'should load more items when reaching end',
            events: [hoverAction('[data-id="a8"]'), clickAction('[data-id="a8"]'), scrollAction(-1), scrollAction(0)],
        }),
        projectThemesPlugin,
    ],
});
