import { createBoard } from '@wixc3/react-board';
import React, { useState } from 'react';
import { createItems, getId, ItemRenderer, noop } from '../../board-assets';
import { projectThemesPlugin } from '../../board-plugins';
import { scenarioPlugin } from '../../board-plugins';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList — scroll to selected item',
    Board: () => {
        const [selectedItem, setSelectedItem] = useState('a0');

        return (
            <>
                <div
                    style={{
                        position: 'sticky',
                        textAlign: 'right',
                        top: 0,
                        zIndex: 1,
                    }}
                >
                    <input
                        value={selectedItem}
                        onChange={(event) => setSelectedItem(event.target.value)}
                        aria-colspan={3}
                    />
                </div>

                <ScrollList
                    ItemRenderer={ItemRenderer}
                    items={items}
                    scrollOffset={50}
                    getId={getId}
                    watchScrollWindowSize={true}
                    selectionControl={[selectedItem, noop]}
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
            </>
        );
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 568,
        windowWidth: 600,
        canvasHeight: 39021,
    },
    plugins: [
        scenarioPlugin.use({
            skip: true,
            title: 'should scroll selected element into view',
            events: [],
        }),
        projectThemesPlugin,
    ],
});
