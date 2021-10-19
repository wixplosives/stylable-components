import { createSimulation } from '@wixc3/react-simulation';
import { SearchableText, searchStringContext } from '../searchable-text';
import { classes } from './searchable-text.sim.st.css';
import React from 'react';
export default createSimulation({
    name: 'SearchableText',
    componentType: SearchableText,
    wrapper: ({ renderSimulation }) => {
        return <searchStringContext.Provider value="search">{renderSimulation()}</searchStringContext.Provider>;
    },
    props: {
        text: 'some text with search content asd',
        className: classes.root,
    },
    plugins: [],
});
