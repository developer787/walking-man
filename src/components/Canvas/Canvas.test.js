
import React from 'react';
import { render } from '@testing-library/react';
import { screen  } from '@testing-library/dom'
import Canvas from './Canvas';

test('renders Canvas text', () => {
  const { getByTestId } = render(<Canvas />);
  const canvas = getByTestId("canvas");
  screen.debug(canvas)
  expect(canvas).toBeInTheDocument();
});
