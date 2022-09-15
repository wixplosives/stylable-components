import { createBoard } from '@wixc3/react-board';
import React, { useState } from 'react';
import { createItems, getId, ItemRenderer } from '../../simulation-assets';
import { mixinProjectThemes } from '../../simulation-mixins/mixin-project-themes';
import { scenarioMixin } from '../../simulation-mixins/scenario';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList — scrollToSelected',
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
                    getId={getId}
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
    plugins: [
        mixinProjectThemes,
        scenarioMixin.use({
            title: 'should scroll to selected item',
            events: [],
        }),
    ],
});
