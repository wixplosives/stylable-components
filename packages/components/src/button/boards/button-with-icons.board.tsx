import { createBoard } from '@wixc3/react-board';
import React from 'react';
import { projectThemesPlugin } from '../../board-plugins';
import { classes } from '../../common/common.st.css';
import { Button } from '../button';

export default createBoard({
    name: 'button-with-icons',
    Board: () => (
        <Button>
            <img
                key="img"
                className={classes.icon}
                src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text y='.9em' font-size='90'>🏞</text></svg>"
            />
            <img
                key="img2"
                className={classes.icon}
                src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><text y='.9em' font-size='90'>🏞</text></svg>"
            />
            <span key="text">Click Me!</span>
        </Button>
    ),
    plugins: [projectThemesPlugin],
    environmentProps: {
        windowBackgroundColor: '#fff',
        canvasWidth: 361,
        canvasHeight: 305,
    },
});
