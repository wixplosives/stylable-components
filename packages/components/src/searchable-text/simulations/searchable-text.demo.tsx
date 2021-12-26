import { createDemo } from '@wixc3/react-simulation';
import { SearchableText, searchStringContext } from '../searchable-text';
import { classes } from './searchable-text.sim.st.css';
import React from 'react';
export default createDemo({
    name: 'SearchableText',
    demo: () => (
        <searchStringContext.Provider value="search">
            <SearchableText text="some text with search content asd" className={classes.root} />
        </searchStringContext.Provider>
    ),
    plugins: [],
});
