
import React from 'react';
import { render } from '@testing-library/react';
import { screen  } from '@testing-library/dom'
import Canvas from './Canvas';

test('renders Canvas text', () => {
  const { getByText } = render(<Canvas />);
  const text = getByText(/Canvas/i);
  screen.debug(text)
  expect(text).toBeInTheDocument();
});
