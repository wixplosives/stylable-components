/* eslint-disable react-hooks/rules-of-hooks */
import { createSimulation } from '@wixc3/react-simulation';
import { useCallback, useState } from 'react';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import { clickAction, hoverAction, scenarioMixin, scrollAction } from '../../simulation-mixins/scenario';
import { ScrollList, ScrollListLoadingState } from '../scroll-list';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { sleep } from 'promise-assist';
import { createItems } from '../../simulation-assets/create-items';

export default createSimulation<ScrollList<ItemData, HTMLElement>>({
    name: 'scroll-list-add-more',
    componentType: ScrollList,
    props: {
        ItemRenderer,
        items: [],
        getId: (item: ItemData) => item.id,
        itemCount: -1,
        watchScrollWindoSize: true,
    },
    wrapper: ({ renderSimulation }) => {
        const [items, updateItems] = useState(createItems(0));

        const [loadingState, updateLoadingState] = useState<ScrollListLoadingState>('idle');
        const loadMore = useCallback(
            async (count: number) => {
                updateLoadingState('loading');
                await sleep(100);
                updateItems(items.concat(createItems(items.length, count)));
                updateLoadingState('idle');
            },
            [items]
        );
        return renderSimulation({
            loadMore,
            items,
            loadingState,
        });
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
