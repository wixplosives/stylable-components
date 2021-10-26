import { createSimulation } from '@wixc3/react-simulation';
import { ScrollList } from '../scroll-list';
import React from 'react';
import { ItemData, ItemRenderer } from '../../simulation-assets/item-renderer';
const items = new Array(1000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);

export default createSimulation<ScrollList<ItemData, HTMLElement>>({
    name: 'scroll list with header',
    componentType: ScrollList,
    props: {
        ItemRenderer,
        items,
        getId: (item: ItemData) => item.id,
        scrollListRoot: {
            el: 'div',
            props: {
                style: {
                    position: 'relative',
                    top: '30px',
                },
            },
        },
        initialScrollOffset: 50,
    },
    environmentProps: {
        canvasWidth: 560,
        windowHeight: 624,
    },
    wrapper: (props) => {
        return (
            <div>
                {props.renderSimulation()}
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
        );
    },
});
