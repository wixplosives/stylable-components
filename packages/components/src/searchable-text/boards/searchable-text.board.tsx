import { createBoard } from '@wixc3/react-board';
import { SearchableText, searchStringContext } from '../searchable-text.js';
import { classes } from './searchable-text.board.st.css';
import React from 'react';
export default createBoard({
    name: 'SearchableText',
    Board: () => (
        <searchStringContext.Provider value="search">
            <SearchableText text="some text with search content asd" className={classes.root} />
        </searchStringContext.Provider>
    ),
    plugins: [],
});
