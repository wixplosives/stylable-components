import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { createItems, getId, ItemRenderer } from '../../board-assets';
import { ScrollList } from '../scroll-list';

const items = createItems();

export default createBoard({
    name: 'ScrollList — with header',
    Board: () => (
        <div>
            <ScrollList
                ItemRenderer={ItemRenderer}
                items={items}
                getId={getId}
                scrollListRoot={{
                    el: 'div',
                    props: {
                        style: {
                            position: 'relative',
                            top: '30px',
                        },
                    },
                }}
                scrollOffset={50}
            />
            <h1
                style={{
                    position: 'fixed',
                    background: 'white',
                    top: '0px',
                    marginTop: '0px',
                    height: '50px',
                    borderBottom: '1px solid',
                }}
            >
                Fixed header
            </h1>
        </div>
    ),
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 624,
    },
});
