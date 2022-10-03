import { createBoard } from '@wixc3/react-board';
import React, { useState } from 'react';
import { createItems, getId, ItemData, noop } from '../../board-assets';
import { projectThemesPlugin, scenarioPlugin } from '../../board-plugins';
import {
    selectItemAction,
    selectItemButton,
    selectItemInput,
} from '../../board-plugins/scenario-plugin/actions/select-item-action';
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

const sizes = Array.from({ length: 1000 }, () => Math.random() * 100 + 10);

const ItemRenderer: React.FC<ListItemProps<ItemData>> = (props) => {
    return (
        <div
            style={{
                // height: '50px',
                display: 'flex',
                alignItems: 'center',
                height: `${sizes[parseInt(props.id.substring(1))]!}px`,
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
                    // itemSize={50}
                    // itemSize={() => 50}
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
            skip: true,
            title: 'should scroll selected element into view',
            resetBoard: () => {
                window.scrollTo(0, 0);
            },
            events: [
                selectItemAction('123'),
                // expectElement(
                //     `[data-id='a555']`,
                //     (el) => {
                //         expect(el.getBoundingClientRect().height).to.not.equal(0);
                //     },
                //     'element is visible',
                //     1_000
                // ),
                selectItemAction('321'),
                selectItemAction('444'),
                selectItemAction('777'),
                selectItemAction('888'),
                selectItemAction('999'),
            ],
        }),
        projectThemesPlugin,
    ],
});
