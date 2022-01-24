import React from 'react';
import { createBoard } from '@wixc3/react-board';
import { ZeeRoot } from '../board-mixins/mixin-zee-root';
import { AutoComplete } from './auto-complete';
import { mixinProjectThemes } from '../board-mixins/mixin-project-themes';
import { ItemData, ItemRenderer } from '../board-assets/item-renderer';
import { Root } from '@zeejs/react';
import { classes } from '../themes/white.st.css';

const items = new Array(30000).fill(0).map(
    (_, idx) =>
        ({
            id: 'a' + idx,
            title: 'item number ' + idx,
        } as ItemData)
);
export default createBoard({
    name: 'auto-complete',
    Board: () => {
        return (
            <div className={classes.white}>
                <Root
                    style={{
                        width: '100vw',
                        height: '100vh',
                        position: 'fixed',
                        top: '0px',
                        left: '0px',
                    }}
                >
                    <div
                        style={{
                            width: '250px',
                            height: '40px',
                            position: 'absolute',
                            top: 'calc( 50vh - 20px )',
                            left: 'calc( 50vw - 125px )',
                        }}
                    >
                        <AutoComplete
                            ItemRenderer={ItemRenderer}
                            items={items}
                            getId={(item: ItemData) => item.id}
                            getTextContent={(item: ItemData) => item.title}
                        />
                    </div>
                </Root>
            </div>
        );
    },
    plugins: [ZeeRoot, mixinProjectThemes],
    environmentProps: {
        canvasHeight: 98,
        windowHeight: 576,
        windowWidth: 786,
        canvasWidth: 344,
    },
});
