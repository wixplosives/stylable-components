import React from 'react';
import { expect } from 'chai';
import { renderToString } from 'react-dom/server';
import { Button } from '../button/button';

describe('<Button />', () => {
  it('renders to string without throwing', () => {
    expect(() => renderToString(<Button />)).to.not.throw();
  });
});
