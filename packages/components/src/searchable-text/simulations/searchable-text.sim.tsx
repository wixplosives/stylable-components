import { createSimulation } from '@wixc3/wcs-core';
import { HighlightedString, searchStringContext } from '../searchable-text';
import { classes } from './searchable-text.sim.st.css';
import React from 'react';
export default createSimulation({
  name: 'HighlightedString',
  componentType: HighlightedString,
  wrapper: ({ renderSimulation }) => {
    return <searchStringContext.Provider value="search">{renderSimulation()}</searchStringContext.Provider>;
  },
  props: {
    text: 'some text with search content asd',
    className: classes.root,
  },
  plugins: [],
});
