import React, { useState } from 'react';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
import { ScrollList } from '../scroll-list';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { createBoard } from '@wixc3/react-board';

const items = new Array(1000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);

export default createBoard({
    name: 'ScrollList with scrollPosition',
    Board: () => {
        const [scrollPosition, setScrollPosition] = useState(0);

        const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
            setScrollPosition((e.target as HTMLDivElement).scrollTop);
        };

        return (
            <div style={{ height: '250px', overflow: 'auto' }} onScroll={handleScroll}>
                <ScrollList
                    scrollPosition={scrollPosition}
                    ItemRenderer={ItemRenderer}
                    items={items}
                    getId={(item: ItemData) => item.id}
                    watchScrollWindoSize={true}
                    listRoot={{
                        el: 'div',
                        props: {
                            style: {
                                display: 'grid',
                                gridTemplateColumns: '1fr',
                                gridGap: '20px',
                            },
                        },
                    }}
                    itemGap={20}
                />
            </div>
        );
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 300,
        windowWidth: 600,
    },
    plugins: [mixinProjectThemes],
});
