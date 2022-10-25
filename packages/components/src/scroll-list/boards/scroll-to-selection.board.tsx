import { createBoard } from '@wixc3/react-board';
import React, { useState } from 'react';
import { createItems, getId, ItemData, noop } from '../../board-assets';
import { projectThemesPlugin, scenarioPlugin } from '../../board-plugins';
import { checkItemRenderState } from '../../board-plugins/scenario-plugin/actions/check-item-render-state';
import {
    selectItemButton,
    selectItemByIndex,
    selectItemInput,
} from '../../board-plugins/scenario-plugin/actions/select-item-by-index';
import type { ListItemProps } from '../../list/list';
import { ScrollList } from '../scroll-list';

const items = createItems();
const elementRef: React.RefObject<HTMLDivElement> = {
    current: null,
};

/**
 * Right now scrolling to selection is supported for non-infinite lists; and for those
 * that provide ref to scrollWindow.
 */

// const sizes = Array.from({ length: 1000 }, () => Math.random() * 100 + 10);

const ItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    return (
        <div
            style={{
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                // height: `${sizes[parseInt(props.id.substring(1))]!}px`,
            }}
            data-id={props.id}
        >
            {props.data.title} {props.isSelected && '(selected)'}
        </div>
    );
};

export default createBoard({
    name: 'ScrollList — scroll to selected item',
    Board: () => {
        const initialSelectedIndex = 442;
        const [selectedItem, setSelectedItem] = useState(`a${initialSelectedIndex}`);
        const [input, setInput] = useState(initialSelectedIndex);

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
                        <input
                            id={selectItemInput}
                            value={input}
                            onChange={(event) => setInput(parseInt(event.target.value))}
                        />
                    </label>

                    <button id={selectItemButton} onClick={() => setSelectedItem(`a${input}`)}>
                        Select
                    </button>
                </div>

                <ScrollList
                    scrollWindow={elementRef}
                    watchScrollWindowSize={true}
                    ItemRenderer={ItemRenderer}
                    items={items}
                    itemSize={() => 50}
                    getId={getId}
                    selectionControl={[selectedItem, noop]}
                    scrollListRoot={{
                        el: 'div',
                        props: {
                            id: 'list',
                            style: {
                                width: '200px',
                                height: '400px',
                                overflow: 'auto',
                            },
                            ref: elementRef,
                        },
                    }}
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
            title: 'should scroll selected element into view',
            resetBoard: () => {
                window.scrollTo(0, 0);
            },
            events: [
                ...[0, 555, 341, 999, 823, 543, 0, 123, 942].flatMap((index) => [
                    selectItemByIndex(index.toString()),
                    checkItemRenderState(`a${index}`),
                ]),
            ],
        }),
        projectThemesPlugin,
    ],
});
