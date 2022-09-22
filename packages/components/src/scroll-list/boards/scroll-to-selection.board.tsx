import { createBoard } from '@wixc3/react-board';
import React, { useCallback, useState } from 'react';
import { createItems, getId, ItemRenderer, noop } from '../../board-assets';
import { clickAction, projectThemesPlugin, scenarioPlugin, writeAction } from '../../board-plugins';
import { ScrollList } from '../scroll-list';

const items = createItems();
const inputId = 'input';
const buttonId = 'button';

export default createBoard({
    name: 'ScrollList — scroll to selected item',
    Board: () => {
        const [selectedItem, setSelectedItem] = useState('a0');
        const [input, setInput] = useState('a0');
        const select = useCallback(() => setSelectedItem(input), [input]);

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
                    <label>
                        ID:
                        <input id={inputId} value={input} onChange={(event) => setInput(event.target.value)} />
                    </label>
                    <button id={buttonId} onClick={select}>
                        Select
                    </button>
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
        canvasWidth: 500,
        windowHeight: 600,
        windowWidth: 600,
    },
    plugins: [
        scenarioPlugin.use({
            skip: true,
            title: 'should scroll selected element into view',
            resetBoard: () => {
                window.scrollTo(0, 0);
            },
            events: [writeAction(`#${inputId}`, 'a94'), clickAction(`#${buttonId}`)],
        }),
        projectThemesPlugin,
    ],
});
