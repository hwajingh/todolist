import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  window.localStorage.clear();
});

test('renders the list UI and adds an item', () => {
  render(<App />);
  expect(screen.getByText(/To Do List/i)).toBeInTheDocument();
  const input = screen.getByPlaceholderText(/Add something/i);
  fireEvent.change(input, { target: { value: 'Buy milk' } });
  const buttons = screen.getAllByRole('button');
  fireEvent.click(buttons[0]);
  expect(screen.getByText('Buy milk')).toBeInTheDocument();
  expect(screen.getByText(/Made by Tiger Hong/i)).toBeInTheDocument();
});
